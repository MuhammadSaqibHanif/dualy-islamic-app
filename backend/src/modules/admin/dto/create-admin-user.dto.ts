import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { AdminRole } from '../entities/admin-user.entity';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'admin@dualy.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureAdminPass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: 'John Admin', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  full_name?: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.ADMIN, required: false })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  can_manage_users?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  can_manage_content?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  can_manage_translations?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  can_view_analytics?: boolean;
}