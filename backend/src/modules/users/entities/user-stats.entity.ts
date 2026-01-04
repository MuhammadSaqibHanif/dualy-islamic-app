import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@base/entity/base.entity';
import { User } from './user.entity';

@Entity('user_stats')
export class UserStats extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'integer', default: 0 })
  total_duas_read: number;

  @Column({ type: 'bigint', default: 0 })
  total_dhikr_count: number;

  @Column({ type: 'integer', default: 0 })
  total_challenges_completed: number;

  @Column({ type: 'integer', default: 0 })
  total_challenges_joined: number;

  @Column({ type: 'integer', default: 0 })
  current_streak_days: number;

  @Column({ type: 'integer', default: 0 })
  longest_streak_days: number;

  @Column({ type: 'date', nullable: true })
  last_activity_date: Date;

  @Column({ type: 'integer', default: 0 })
  total_points: number;

  @Column({ type: 'integer', default: 1 })
  level: number;

  @OneToOne(() => User, (user) => user.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}