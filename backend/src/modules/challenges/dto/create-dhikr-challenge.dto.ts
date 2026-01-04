import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  IsDateString,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChallengeType, ChallengeDifficulty, RewardAssignment } from '../entities/dhikr-challenge.entity';

class ChallengeTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  language_code: string;

  @ApiProperty({ example: 'Subhanallah 100 times' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Recite Subhanallah 100 times daily', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Glory be to Allah', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  dhikr_text_translation?: string;

  @ApiProperty({ example: 'Purifies the heart', required: false })
  @IsOptional()
  @IsString()
  benefits?: string;
}

export class CreateDhikrChallengeDto {
  @ApiProperty({ example: 'subhanallah_100' })
  @IsString()
  @MaxLength(100)
  title_key: string;

  @ApiProperty({ example: 'subhanallah_desc', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description_key?: string;

  @ApiProperty({ enum: ChallengeType, example: ChallengeType.SINGULAR })
  @IsEnum(ChallengeType)
  type: ChallengeType;

  @ApiProperty({ enum: ChallengeDifficulty, example: ChallengeDifficulty.EASY, required: false })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Type(() => Number)
  target_count: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  duration_days?: number;

  @ApiProperty({ example: 'سُبْحَانَ اللَّهِ' })
  @IsString()
  arabic_text: string;

  @ApiProperty({ example: 'Subhanallah', required: false })
  @IsOptional()
  @IsString()
  transliteration?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ example: 'https://example.com/audio.mp3', required: false })
  @IsOptional()
  @IsUrl()
  audio_url?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  reward_points?: number;

  @ApiProperty({ enum: RewardAssignment, example: RewardAssignment.PER_TAP, required: false })
  @IsOptional()
  @IsEnum(RewardAssignment)
  reward_assignment?: RewardAssignment;

  @ApiProperty({ example: 'https://example.com/badge.png', required: false })
  @IsOptional()
  @IsUrl()
  badge_icon_url?: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;

  @ApiProperty({ example: 'daily', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  recurrence_pattern?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  display_order?: number;

  @ApiProperty({ type: [ChallengeTranslationDto] })
  @Type(() => ChallengeTranslationDto)
  translations: ChallengeTranslationDto[];
}