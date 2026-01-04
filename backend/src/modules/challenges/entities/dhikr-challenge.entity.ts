import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@base/entity/base.entity';
import { DhikrChallengeTranslation } from './dhikr-challenge-translation.entity';

export enum ChallengeType {
  SINGULAR = 'singular',
  COLLABORATIVE = 'collaborative',
}

export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum RewardAssignment {
  PER_TAP = 'per_tap',
  ON_CHALLENGE_COMPLETE = 'on_challenge_complete',
}

@Entity('dhikr_challenges')
export class DhikrChallenge extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  title_key: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description_key: string;

  @Column({ type: 'enum', enum: ChallengeType })
  type: ChallengeType;

  @Column({ type: 'enum', enum: ChallengeDifficulty, default: ChallengeDifficulty.MEDIUM })
  difficulty: ChallengeDifficulty;

  @Column({ type: 'integer' })
  target_count: number;

  @Column({ type: 'integer', nullable: true })
  duration_days: number;

  @Column({ type: 'text' })
  arabic_text: string;

  @Column({ type: 'text', nullable: true })
  transliteration: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  audio_url: string;

  @Column({ type: 'integer', default: 0 })
  reward_points: number;

  @Column({ type: 'enum', enum: RewardAssignment, default: RewardAssignment.PER_TAP })
  reward_assignment: RewardAssignment;

  @Column({ type: 'text', nullable: true })
  badge_icon_url: string;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'boolean', default: false })
  is_recurring: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recurrence_pattern: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @OneToMany(() => DhikrChallengeTranslation, (translation) => translation.challenge)
  translations: DhikrChallengeTranslation[];
}