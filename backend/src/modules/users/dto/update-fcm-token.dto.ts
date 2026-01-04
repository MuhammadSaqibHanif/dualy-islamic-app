import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({ example: 'fcm-token-here' })
  @IsString()
  fcm_token: string;

  @ApiProperty({ example: 'device-uuid-123' })
  @IsString()
  device_id: string;
}