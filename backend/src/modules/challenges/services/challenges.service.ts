import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@base/service/base.service';
import { DhikrChallenge, ChallengeType } from '../entities/dhikr-challenge.entity';
import { DhikrChallengeTranslation } from '../entities/dhikr-challenge-translation.entity';
import { UserChallengeProgress, ChallengeStatus } from '../entities/user-challenge-progress.entity';
import { UserDhikrEntry } from '../entities/user-dhikr-entry.entity';
import { CollaborativeChallengeStats } from '../entities/collaborative-challenge-stats.entity';
import { Language } from '@modules/languages/entities/language.entity';
import {
  CreateDhikrChallengeDto,
  UpdateDhikrChallengeDto,
  SubmitDhikrProgressDto,
  QueryChallengesDto,
} from '../dto';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class ChallengesService extends BaseService<DhikrChallenge> {
  constructor(
    @InjectRepository(DhikrChallenge)
    protected repository: Repository<DhikrChallenge>,
    @InjectRepository(DhikrChallengeTranslation)
    private challengeTranslationRepository: Repository<DhikrChallengeTranslation>,
    @InjectRepository(UserChallengeProgress)
    private progressRepository: Repository<UserChallengeProgress>,
    @InjectRepository(UserDhikrEntry)
    private dhikrEntryRepository: Repository<UserDhikrEntry>,
    @InjectRepository(CollaborativeChallengeStats)
    private collaborativeStatsRepository: Repository<CollaborativeChallengeStats>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private usersService: UsersService,
  ) {
    super();
  }

  async findAllWithTranslations(queryChallengesDto: QueryChallengesDto) {
    const { type, difficulty, language, is_active, page = 1, limit = 10 } = queryChallengesDto;

    const queryBuilder = this.repository
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'lang')
      .where('challenge.deleted_at IS NULL');

    if (type) {
      queryBuilder.andWhere('challenge.type = :type', { type });
    }

    if (difficulty) {
      queryBuilder.andWhere('challenge.difficulty = :difficulty', { difficulty });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('challenge.is_active = :is_active', { is_active });
    }

    if (language) {
      queryBuilder.andWhere('lang.code = :language', { language });
    }

    queryBuilder.orderBy('challenge.display_order', 'ASC').addOrderBy('challenge.created_at', 'DESC');

    const skip = (page - 1) * limit;
    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneWithTranslations(id: string, languageCode?: string) {
    const queryBuilder = this.repository
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .where('challenge.id = :id', { id })
      .andWhere('challenge.deleted_at IS NULL');

    if (languageCode) {
      queryBuilder.andWhere('language.code = :languageCode', { languageCode });
    }

    const challenge = await queryBuilder.getOne();

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    return challenge;
  }

  async createChallenge(createChallengeDto: CreateDhikrChallengeDto) {
    const challenge = this.repository.create({
      title_key: createChallengeDto.title_key,
      description_key: createChallengeDto.description_key,
      type: createChallengeDto.type,
      difficulty: createChallengeDto.difficulty,
      target_count: createChallengeDto.target_count,
      duration_days: createChallengeDto.duration_days,
      arabic_text: createChallengeDto.arabic_text,
      transliteration: createChallengeDto.transliteration,
      image_url: createChallengeDto.image_url,
      audio_url: createChallengeDto.audio_url,
      reward_points: createChallengeDto.reward_points || 0,
      reward_assignment: createChallengeDto.reward_assignment,
      badge_icon_url: createChallengeDto.badge_icon_url,
      start_date: createChallengeDto.start_date ? new Date(createChallengeDto.start_date) : null,
      end_date: createChallengeDto.end_date ? new Date(createChallengeDto.end_date) : null,
      is_recurring: createChallengeDto.is_recurring || false,
      recurrence_pattern: createChallengeDto.recurrence_pattern,
      is_active: createChallengeDto.is_active !== undefined ? createChallengeDto.is_active : true,
      display_order: createChallengeDto.display_order || 0,
    });

    const savedChallenge = await this.repository.save(challenge);

    // Create translations
    if (createChallengeDto.translations && createChallengeDto.translations.length > 0) {
      for (const translationDto of createChallengeDto.translations) {
        const language = await this.languageRepository.findOne({
          where: { code: translationDto.language_code },
        });

        if (language) {
          const translation = this.challengeTranslationRepository.create({
            challenge_id: savedChallenge.id,
            language_id: language.id,
            title: translationDto.title,
            description: translationDto.description,
            dhikr_text_translation: translationDto.dhikr_text_translation,
            benefits: translationDto.benefits,
          });

          await this.challengeTranslationRepository.save(translation);
        }
      }
    }

    // Initialize collaborative stats if collaborative
    if (savedChallenge.type === ChallengeType.COLLABORATIVE) {
      await this.initializeCollaborativeStats(savedChallenge.id);
    }

    return this.findById(savedChallenge.id, ['translations', 'translations.language']);
  }

  async updateChallenge(id: string, updateChallengeDto: UpdateDhikrChallengeDto) {
    const challenge = await this.findByIdOrFail(id);

    // Update fields
    Object.assign(challenge, updateChallengeDto);

    if (updateChallengeDto.start_date) {
      challenge.start_date = new Date(updateChallengeDto.start_date);
    }
    if (updateChallengeDto.end_date) {
      challenge.end_date = new Date(updateChallengeDto.end_date);
    }

    await this.repository.save(challenge);

    // Update translations if provided
    if (updateChallengeDto.translations) {
      for (const translationDto of updateChallengeDto.translations) {
        const language = await this.languageRepository.findOne({
          where: { code: translationDto.language_code },
        });

        if (language) {
          let translation = await this.challengeTranslationRepository.findOne({
            where: { challenge_id: id, language_id: language.id },
          });

          if (translation) {
            Object.assign(translation, translationDto);
          } else {
            translation = this.challengeTranslationRepository.create({
              challenge_id: id,
              language_id: language.id,
              ...translationDto,
            });
          }

          await this.challengeTranslationRepository.save(translation);
        }
      }
    }

    return this.findById(id, ['translations', 'translations.language']);
  }

  // User Challenge Progress
  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.findByIdOrFail(challengeId);

    // Check if already joined
    const existing = await this.progressRepository.findOne({
      where: { user_id: userId, challenge_id: challengeId },
    });

    if (existing) {
      return existing;
    }

    // Create progress
    const progress = this.progressRepository.create({
      user_id: userId,
      challenge_id: challengeId,
      current_count: 0,
      target_count: challenge.target_count,
      status: ChallengeStatus.ACTIVE,
    });

    await this.progressRepository.save(progress);

    // Increment user stats
    await this.usersService.incrementChallengesJoined(userId);

    // Update collaborative stats if collaborative
    if (challenge.type === ChallengeType.COLLABORATIVE) {
      await this.incrementCollaborativeParticipants(challengeId);
    }

    return progress;
  }

  async submitProgress(
    userId: string,
    challengeId: string,
    submitDto: SubmitDhikrProgressDto,
  ) {
    const challenge = await this.findByIdOrFail(challengeId);

    // Get or create progress
    let progress = await this.progressRepository.findOne({
      where: { user_id: userId, challenge_id: challengeId },
    });

    if (!progress) {
      progress = await this.joinChallenge(userId, challengeId);
    }

    if (progress.status !== ChallengeStatus.ACTIVE) {
      throw new BadRequestException('Challenge is not active');
    }

    // Record dhikr entry
    const entry = this.dhikrEntryRepository.create({
      user_id: userId,
      challenge_id: challengeId,
      count: submitDto.count,
      device_id: submitDto.device_id,
      synced_at: new Date(),
    });

    await this.dhikrEntryRepository.save(entry);

    // Update progress
    progress.current_count += submitDto.count;
    progress.last_updated_at = new Date();

    // Check if completed
    if (progress.current_count >= progress.target_count) {
      progress.status = ChallengeStatus.COMPLETED;
      progress.completed_at = new Date();

      // Award points
      await this.usersService.incrementChallengesCompleted(userId, challenge.reward_points);
    }

    await this.progressRepository.save(progress);

    // Update user dhikr stats
    await this.usersService.incrementDhikrCount(userId, submitDto.count);

    // Update collaborative stats if collaborative
    if (challenge.type === ChallengeType.COLLABORATIVE) {
      await this.incrementCollaborativeCount(challengeId, submitDto.count);
    }

    return {
      progress,
      completed: progress.status === ChallengeStatus.COMPLETED,
      points_earned: progress.status === ChallengeStatus.COMPLETED ? challenge.reward_points : 0,
    };
  }

  async getUserProgress(userId: string, challengeId: string) {
    const progress = await this.progressRepository.findOne({
      where: { user_id: userId, challenge_id: challengeId },
      relations: ['challenge', 'challenge.translations'],
    });

    if (!progress) {
      throw new NotFoundException('Progress not found');
    }

    return progress;
  }

  async getUserActiveChallenges(userId: string) {
    return this.progressRepository.find({
      where: { user_id: userId, status: ChallengeStatus.ACTIVE },
      relations: ['challenge', 'challenge.translations'],
      order: { started_at: 'DESC' },
    });
  }

  async getUserCompletedChallenges(userId: string, page: number = 1, limit: number = 10) {
    const [data, total] = await this.progressRepository.findAndCount({
      where: { user_id: userId, status: ChallengeStatus.COMPLETED },
      relations: ['challenge', 'challenge.translations'],
      skip: (page - 1) * limit,
      take: limit,
      order: { completed_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Collaborative Challenge Stats
  private async initializeCollaborativeStats(challengeId: string) {
    const stats = this.collaborativeStatsRepository.create({
      challenge_id: challengeId,
      total_participants: 0,
      total_count: 0,
    });

    return this.collaborativeStatsRepository.save(stats);
  }

  private async incrementCollaborativeParticipants(challengeId: string) {
    let stats = await this.collaborativeStatsRepository.findOne({
      where: { challenge_id: challengeId },
    });

    if (!stats) {
      stats = await this.initializeCollaborativeStats(challengeId);
    }

    stats.total_participants += 1;
    stats.last_updated_at = new Date();

    return this.collaborativeStatsRepository.save(stats);
  }

  private async incrementCollaborativeCount(challengeId: string, count: number) {
    let stats = await this.collaborativeStatsRepository.findOne({
      where: { challenge_id: challengeId },
    });

    if (!stats) {
      stats = await this.initializeCollaborativeStats(challengeId);
    }

    stats.total_count = Number(stats.total_count) + count;
    stats.last_updated_at = new Date();

    return this.collaborativeStatsRepository.save(stats);
  }

  async getCollaborativeStats(challengeId: string) {
    const stats = await this.collaborativeStatsRepository.findOne({
      where: { challenge_id: challengeId },
      relations: ['challenge'],
    });

    if (!stats) {
      throw new NotFoundException('Collaborative stats not found');
    }

    return stats;
  }
}