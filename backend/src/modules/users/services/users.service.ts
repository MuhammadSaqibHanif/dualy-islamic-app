import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@base/service/base.service';
import { User } from '../entities/user.entity';
import { UserStats } from '../entities/user-stats.entity';
import { UserDailyActivity } from '../entities/user-daily-activity.entity';
import { Language } from '@modules/languages/entities/language.entity';
import { UpdateProfileDto, UpdateFcmTokenDto } from '../dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected repository: Repository<User>,
    @InjectRepository(UserStats)
    private userStatsRepository: Repository<UserStats>,
    @InjectRepository(UserDailyActivity)
    private dailyActivityRepository: Repository<UserDailyActivity>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['preferred_language'],
    });
  }

  async findLanguageByCode(code: string): Promise<Language | null> {
    return this.languageRepository.findOne({ where: { code } });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findByIdOrFail(userId, ['preferred_language']);

    if (updateProfileDto.full_name !== undefined) {
      user.full_name = updateProfileDto.full_name;
    }

    if (updateProfileDto.phone_number !== undefined) {
      user.phone_number = updateProfileDto.phone_number;
    }

    if (updateProfileDto.profile_picture_url !== undefined) {
      user.profile_picture_url = updateProfileDto.profile_picture_url;
    }

    if (updateProfileDto.timezone !== undefined) {
      user.timezone = updateProfileDto.timezone;
    }

    if (updateProfileDto.preferred_language_code) {
      const language = await this.findLanguageByCode(
        updateProfileDto.preferred_language_code,
      );
      if (language) {
        user.preferred_language_id = language.id;
      }
    }

    await this.repository.save(user);

    return this.findById(userId, ['preferred_language']);
  }

  async getProfile(userId: string) {
    const user = await this.findByIdOrFail(userId, ['preferred_language', 'stats']);
    return user;
  }

  async getUserStats(userId: string) {
    let stats = await this.userStatsRepository.findOne({
      where: { user_id: userId },
    });

    if (!stats) {
      stats = await this.createUserStats(userId);
    }

    return stats;
  }

  async createUserStats(userId: string) {
    const stats = this.userStatsRepository.create({
      user_id: userId,
      total_duas_read: 0,
      total_dhikr_count: 0,
      total_challenges_completed: 0,
      total_challenges_joined: 0,
      current_streak_days: 0,
      longest_streak_days: 0,
      total_points: 0,
      level: 1,
    });

    return this.userStatsRepository.save(stats);
  }

  async incrementDuasRead(userId: string) {
    const stats = await this.getUserStats(userId);
    stats.total_duas_read += 1;
    await this.userStatsRepository.save(stats);

    // Update daily activity
    await this.updateDailyActivity(userId, { duas_read: 1 });

    // Update streak
    await this.updateStreak(userId);
  }

  async incrementDhikrCount(userId: string, count: number) {
    const stats = await this.getUserStats(userId);
    stats.total_dhikr_count = Number(stats.total_dhikr_count) + count;
    await this.userStatsRepository.save(stats);

    // Update daily activity
    await this.updateDailyActivity(userId, { dhikr_count: count });

    // Update streak
    await this.updateStreak(userId);
  }

  async incrementChallengesJoined(userId: string) {
    const stats = await this.getUserStats(userId);
    stats.total_challenges_joined += 1;
    await this.userStatsRepository.save(stats);
  }

  async incrementChallengesCompleted(userId: string, points: number) {
    const stats = await this.getUserStats(userId);
    stats.total_challenges_completed += 1;
    stats.total_points += points;
    
    // Level up logic (every 100 points = 1 level)
    stats.level = Math.floor(stats.total_points / 100) + 1;
    
    await this.userStatsRepository.save(stats);

    // Update daily activity
    await this.updateDailyActivity(userId, { challenges_completed: 1 });
  }

  private async updateDailyActivity(
    userId: string,
    updates: {
      duas_read?: number;
      dhikr_count?: number;
      challenges_completed?: number;
      session_duration_minutes?: number;
    },
  ) {
    const today = new Date().toISOString().split('T')[0];

    let activity = await this.dailyActivityRepository.findOne({
      where: { user_id: userId, activity_date: new Date(today) },
    });

    if (!activity) {
      activity = this.dailyActivityRepository.create({
        user_id: userId,
        activity_date: new Date(today),
        duas_read: 0,
        dhikr_count: 0,
        challenges_completed: 0,
        session_duration_minutes: 0,
      });
    }

    if (updates.duas_read) {
      activity.duas_read += updates.duas_read;
    }

    if (updates.dhikr_count) {
      activity.dhikr_count += updates.dhikr_count;
    }

    if (updates.challenges_completed) {
      activity.challenges_completed += updates.challenges_completed;
    }

    if (updates.session_duration_minutes) {
      activity.session_duration_minutes += updates.session_duration_minutes;
    }

    await this.dailyActivityRepository.save(activity);
  }

  private async updateStreak(userId: string) {
    const stats = await this.getUserStats(userId);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if user was active today
    const todayActivity = await this.dailyActivityRepository.findOne({
      where: { user_id: userId, activity_date: new Date(today) },
    });

    if (!todayActivity) {
      return; // No activity today yet
    }

    // Update last activity date
    stats.last_activity_date = new Date(today);

    // Check if user was active yesterday
    const yesterdayActivity = await this.dailyActivityRepository.findOne({
      where: { user_id: userId, activity_date: new Date(yesterdayStr) },
    });

    if (yesterdayActivity) {
      // Continue streak
      stats.current_streak_days += 1;
    } else if (!stats.last_activity_date || stats.last_activity_date.toISOString().split('T')[0] !== yesterdayStr) {
      // Streak broken, reset to 1
      stats.current_streak_days = 1;
    }

    // Update longest streak
    if (stats.current_streak_days > stats.longest_streak_days) {
      stats.longest_streak_days = stats.current_streak_days;
    }

    await this.userStatsRepository.save(stats);
  }

  async getDailyActivity(userId: string, days: number = 7) {
    const activities = await this.dailyActivityRepository.find({
      where: { user_id: userId },
      order: { activity_date: 'DESC' },
      take: days,
    });

    return activities;
  }

  async updateFcmToken(userId: string, updateFcmTokenDto: UpdateFcmTokenDto) {
    // This would update the session's FCM token
    // Implementation depends on session management strategy
    return { message: 'FCM token updated successfully' };
  }
}