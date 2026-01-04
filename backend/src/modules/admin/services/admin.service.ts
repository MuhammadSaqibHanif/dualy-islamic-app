import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../entities/admin-user.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { AdminLoginDto, CreateAdminUserDto, UpdateAdminUserDto } from '../dto';
import { BaseService } from '@base/service/base.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private repository: Repository<AdminUser>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findById(id: string): Promise<AdminUser | null> {
    return this.repository.findOne({ where: { id } });
  }

  async login(adminLoginDto: AdminLoginDto, ipAddress?: string) {
    const admin = await this.repository.findOne({
      where: { email: adminLoginDto.email, is_active: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(adminLoginDto.password, admin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    admin.last_login_at = new Date();
    await this.repository.save(admin);

    const access_token = await this.generateToken(admin);

    return {
      access_token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        can_manage_users: admin.can_manage_users,
        can_manage_content: admin.can_manage_content,
        can_manage_translations: admin.can_manage_translations,
        can_view_analytics: admin.can_view_analytics,
      },
    };
  }

  async createAdmin(createAdminDto: CreateAdminUserDto) {
    const existing = await this.repository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const password_hash = await bcrypt.hash(createAdminDto.password, 10);

    const admin = this.repository.create({
      ...createAdminDto,
      password_hash,
    });

    return this.repository.save(admin);
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminUserDto) {
    const admin = await this.repository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    Object.assign(admin, updateAdminDto);
    return this.repository.save(admin);
  }

  async logAction(
    adminId: string,
    action: string,
    entityType: string,
    entityId?: string,
    oldData?: any,
    newData?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const log = this.auditLogRepository.create({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_data: oldData,
      new_data: newData,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    return this.auditLogRepository.save(log);
  }

  private async generateToken(admin: AdminUser) {
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      isAdmin: true,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '8h',
    });
  }
}