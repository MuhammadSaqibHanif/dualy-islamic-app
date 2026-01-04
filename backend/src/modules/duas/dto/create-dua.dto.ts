import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class DuaTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  language_code: string;

  @ApiProperty({ example: 'O Allah, guide me...' })
  @IsString()
  translation: string;

  @ApiProperty({ example: 'Brings peace and guidance', required: false })
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiProperty({ example: 'Dr. Translator', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  translator_name?: string;
}

export class CreateDuaDto {
  @ApiProperty({ example: 'uuid-of-category', required: false })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({ example: 'Sahih Bukhari 123', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string;

  @ApiProperty({ example: 'hadith', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reference_type?: string;

  @ApiProperty({ example: 'اللَّهُمَّ اهْدِنِي' })
  @IsString()
  arabic_text: string;

  @ApiProperty({ example: 'Allahumma ihdini', required: false })
  @IsOptional()
  @IsString()
  transliteration?: string;

  @ApiProperty({ example: 'https://example.com/audio.mp3', required: false })
  @IsOptional()
  @IsUrl()
  audio_url?: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  audio_duration_seconds?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  recitation_count?: number;

  @ApiProperty({ example: 'protection_benefit', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  benefits_key?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  display_order?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiProperty({ type: [DuaTranslationDto] })
  @Type(() => DuaTranslationDto)
  translations: DuaTranslationDto[];
}