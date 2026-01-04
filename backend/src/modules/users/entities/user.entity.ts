import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '@base/entity/base.entity';
import { Language } from '@modules/languages/entities/language.entity';
import { UserSession } from './user-session.entity';
import { UserStats } from './user-stats.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  profile_picture_url: string;

  @Column({ type: 'uuid', nullable: true })
  preferred_language_id: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email_verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verification_expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  // Relations
  @ManyToOne(() => Language, { nullable: true })
  @JoinColumn({ name: 'preferred_language_id' })
  preferred_language: Language;

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @OneToOne(() => UserStats, (stats) => stats.user)
  stats: UserStats;
}