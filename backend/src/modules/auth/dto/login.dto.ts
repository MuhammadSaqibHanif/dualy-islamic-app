import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'device-uuid-123', required: false })
  @IsOptional()
  @IsString()
  device_id?: string;

  @ApiProperty({ example: 'iPhone 14', required: false })
  @IsOptional()
  @IsString()
  device_name?: string;

  @ApiProperty({ example: 'ios', required: false })
  @IsOptional()
  @IsString()
  device_type?: string;
}