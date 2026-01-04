import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { DhikrChallenge } from './dhikr-challenge.entity';
import { Language } from '@modules/languages/entities/language.entity';

@Entity('dhikr_challenge_translations')
@Index(['challenge_id', 'language_id'], { unique: true })
export class DhikrChallengeTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  challenge_id: string;

  @Column({ type: 'uuid' })
  language_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dhikr_text_translation: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => DhikrChallenge, (challenge) => challenge.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challenge_id' })
  challenge: DhikrChallenge;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: Language;
}