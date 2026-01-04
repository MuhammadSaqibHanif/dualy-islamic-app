import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class JoinChallengeDto {
  @ApiProperty({ example: 'uuid-of-challenge' })
  @IsUUID()
  challenge_id: string;
}