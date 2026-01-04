import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesController } from './controllers/challenges.controller';
import { ChallengesService } from './services/challenges.service';
import { DhikrChallenge } from './entities/dhikr-challenge.entity';
import { DhikrChallengeTranslation } from './entities/dhikr-challenge-translation.entity';
import { UserChallengeProgress } from './entities/user-challenge-progress.entity';
import { UserDhikrEntry } from './entities/user-dhikr-entry.entity';
import { CollaborativeChallengeStats } from './entities/collaborative-challenge-stats.entity';
import { LanguagesModule } from '@modules/languages/languages.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DhikrChallenge,
      DhikrChallengeTranslation,
      UserChallengeProgress,
      UserDhikrEntry,
      CollaborativeChallengeStats,
    ]),
    LanguagesModule,
    UsersModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}