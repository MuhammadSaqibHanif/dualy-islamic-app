import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ChallengeType, ChallengeDifficulty } from '../entities/dhikr-challenge.entity';

export class QueryChallengesDto {
  @ApiProperty({ enum: ChallengeType, required: false })
  @IsOptional()
  @IsEnum(ChallengeType)
  type?: ChallengeType;

  @ApiProperty({ enum: ChallengeDifficulty, required: false })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'true', required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ example: '10', required: false })
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}