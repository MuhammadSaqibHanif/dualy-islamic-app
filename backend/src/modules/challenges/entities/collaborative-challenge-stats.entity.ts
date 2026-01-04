import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DhikrChallenge } from './dhikr-challenge.entity';

@Entity('collaborative_challenge_stats')
export class CollaborativeChallengeStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  challenge_id: string;

  @Column({ type: 'integer', default: 0 })
  total_participants: number;

  @Column({ type: 'bigint', default: 0 })
  total_count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated_at: Date;

  @ManyToOne(() => DhikrChallenge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challenge_id' })
  challenge: DhikrChallenge;
}