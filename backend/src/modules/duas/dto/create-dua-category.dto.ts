import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Matches, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  language_code: string;

  @ApiProperty({ example: 'Morning Duas' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Duas to recite in the morning', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateDuaCategoryDto {
  @ApiProperty({ example: 'morning_duas' })
  @IsString()
  @MaxLength(100)
  name_key: string;

  @ApiProperty({ example: 'https://example.com/icon.png', required: false })
  @IsOptional()
  @IsString()
  icon_url?: string;

  @ApiProperty({ example: '#4CAF50', required: false })
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i)
  color_hex?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  display_order?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ type: [CategoryTranslationDto] })
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];
}