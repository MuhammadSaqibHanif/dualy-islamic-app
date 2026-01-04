import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDuasDto {
  @ApiProperty({ example: 'uuid-of-category', required: false })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'true', required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_featured?: boolean;

  @ApiProperty({ example: 'morning', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ example: '10', required: false })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}