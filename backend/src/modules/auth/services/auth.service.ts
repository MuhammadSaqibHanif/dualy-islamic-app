import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@modules/users/entities/user.entity';
import { UserSession } from '@modules/users/entities/user-session.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { UsersService } from '@modules/users/services/users.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
    @InjectRepository(PasswordResetToken)
    private passwordResetRepository: Repository<PasswordResetToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const password_hash = await bcrypt.hash(registerDto.password, 10);

    // Generate email verification token
    const email_verification_token = uuidv4();
    const email_verification_expires_at = new Date();
    email_verification_expires_at.setHours(email_verification_expires_at.getHours() + 24);

    // Create user
    const user = this.userRepository.create({
      email: registerDto.email,
      password_hash,
      full_name: registerDto.full_name,
      phone_number: registerDto.phone_number,
      timezone: registerDto.timezone || 'UTC',
      email_verification_token,
      email_verification_expires_at,
      is_email_verified: false,
      is_active: true,
    });

    // Set preferred language if provided
    if (registerDto.preferred_language_code) {
      const language = await this.usersService.findLanguageByCode(
        registerDto.preferred_language_code,
      );
      if (language) {
        user.preferred_language_id = language.id;
      }
    }

    await this.userRepository.save(user);

    // Initialize user stats
    await this.usersService.createUserStats(user.id);

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(user.email, email_verification_token);

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      message: 'Registration successful. Please verify your email.',
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['preferred_language'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Check if email is verified
    if (!user.is_email_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // Generate tokens
    const { access_token, refresh_token } = await this.generateTokens(user.id, user.email);

    // Create or update session
    const device_id = loginDto.device_id || uuidv4();
    await this.createSession(
      user.id,
      device_id,
      refresh_token,
      loginDto.device_name,
      loginDto.device_type,
      ipAddress,
      userAgent,
    );

    // Update last login
    user.last_login_at = new Date();
    await this.userRepository.save(user);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        profile_picture_url: user.profile_picture_url,
        preferred_language: user.preferred_language,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { email_verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.is_email_verified) {
      throw new BadRequestException('Email already verified');
    }

    if (new Date() > user.email_verification_expires_at) {
      throw new BadRequestException('Verification token expired');
    }

    user.is_email_verified = true;
    user.email_verification_token = null;
    user.email_verification_expires_at = null;

    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, ipAddress?: string) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    // Don't reveal if email exists or not
    if (!user) {
      return { message: 'If email exists, password reset link has been sent' };
    }

    // Generate reset token
    const token = uuidv4();
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 1); // 1 hour expiry

    const resetToken = this.passwordResetRepository.create({
      user_id: user.id,
      token,
      expires_at,
      ip_address: ipAddress,
    });

    await this.passwordResetRepository.save(resetToken);

    // TODO: Send password reset email
    // await this.emailService.sendPasswordResetEmail(user.email, token);

    return { message: 'If email exists, password reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetToken = await this.passwordResetRepository.findOne({
      where: { token: resetPasswordDto.token },
      relations: ['user'],
    });

    if (!resetToken || resetToken.used_at) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > resetToken.expires_at) {
      throw new BadRequestException('Reset token expired');
    }

    // Hash new password
    const password_hash = await bcrypt.hash(resetPasswordDto.new_password, 10);

    // Update user password
    resetToken.user.password_hash = password_hash;
    await this.userRepository.save(resetToken.user);

    // Mark token as used
    resetToken.used_at = new Date();
    await this.passwordResetRepository.save(resetToken);

    // Invalidate all sessions
    await this.sessionRepository.delete({ user_id: resetToken.user.id });

    return { message: 'Password reset successful' };
  }

  async refreshToken(refresh_token: string) {
    const session = await this.sessionRepository.findOne({
      where: { refresh_token },
      relations: ['user'],
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > session.expires_at) {
      await this.sessionRepository.delete(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(session.user.id, session.user.email);

    // Update session
    session.refresh_token = tokens.refresh_token;
    session.last_active_at = new Date();
    await this.sessionRepository.save(session);

    return tokens;
  }

  async logout(userId: string, deviceId?: string) {
    if (deviceId) {
      await this.sessionRepository.delete({ user_id: userId, device_id: deviceId });
    } else {
      await this.sessionRepository.delete({ user_id: userId });
    }

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    return { access_token, refresh_token };
  }

  private async createSession(
    userId: string,
    deviceId: string,
    refreshToken: string,
    deviceName?: string,
    deviceType?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Delete old session for this device
    await this.sessionRepository.delete({ user_id: userId, device_id: deviceId });

    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7); // 7 days

    const session = this.sessionRepository.create({
      user_id: userId,
      device_id: deviceId,
      device_name: deviceName,
      device_type: deviceType,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at,
    });

    await this.sessionRepository.save(session);
  }
}