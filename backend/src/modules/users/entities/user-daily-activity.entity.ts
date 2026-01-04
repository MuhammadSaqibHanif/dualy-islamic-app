import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('user_daily_activity')
@Index(['user_id', 'activity_date'], { unique: true })
export class UserDailyActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'date' })
  activity_date: Date;

  @Column({ type: 'integer', default: 0 })
  duas_read: number;

  @Column({ type: 'integer', default: 0 })
  dhikr_count: number;

  @Column({ type: 'integer', default: 0 })
  challenges_completed: number;

  @Column({ type: 'integer', default: 0 })
  session_duration_minutes: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}