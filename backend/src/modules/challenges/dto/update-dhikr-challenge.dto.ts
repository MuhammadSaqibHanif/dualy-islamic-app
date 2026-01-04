import { PartialType } from '@nestjs/swagger';
import { CreateDhikrChallengeDto } from './create-dhikr-challenge.dto';

export class UpdateDhikrChallengeDto extends PartialType(CreateDhikrChallengeDto) {}