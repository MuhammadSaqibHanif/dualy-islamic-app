import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Dua } from './dua.entity';
import { Language } from '@modules/languages/entities/language.entity';

@Entity('dua_translations')
@Index(['dua_id', 'language_id'], { unique: true })
export class DuaTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  dua_id: string;

  @Column({ type: 'uuid' })
  language_id: string;

  @Column({ type: 'text' })
  translation: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  translator_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Dua, (dua) => dua.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dua_id' })
  dua: Dua;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: Language;
}