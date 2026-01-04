import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  device_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  device_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  device_type: string;

  @Exclude()
  @Column({ type: 'varchar', length: 500, unique: true })
  refresh_token: string;

  @Column({ type: 'integer', default: 1 })
  access_token_version: number;

  @Column({ type: 'text', nullable: true })
  fcm_token: string;

  @Column({ type: 'inet', nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_active_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}