import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { UserStats } from './entities/user-stats.entity';
import { UserDailyActivity } from './entities/user-daily-activity.entity';
import { UserSession } from './entities/user-session.entity';
import { LanguagesModule } from '@modules/languages/languages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserStats, UserDailyActivity, UserSession]),
    LanguagesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}