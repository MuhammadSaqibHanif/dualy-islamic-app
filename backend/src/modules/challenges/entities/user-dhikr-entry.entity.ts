import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { DhikrChallenge } from './dhikr-challenge.entity';

@Entity('user_dhikr_entries')
export class UserDhikrEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  challenge_id: string;

  @Column({ type: 'integer' })
  count: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  device_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recorded_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  synced_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => DhikrChallenge, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'challenge_id' })
  challenge: DhikrChallenge;
}