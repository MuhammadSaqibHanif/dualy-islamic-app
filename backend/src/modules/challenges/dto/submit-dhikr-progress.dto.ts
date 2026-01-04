import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitDhikrProgressDto {
  @ApiProperty({ example: 33 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  count: number;

  @ApiProperty({ example: 'device-uuid-123', required: false })
  @IsOptional()
  @IsString()
  device_id?: string;
}