import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { DuaCategory } from './dua-category.entity';
import { Language } from '@modules/languages/entities/language.entity';

@Entity('dua_category_translations')
@Index(['category_id', 'language_id'], { unique: true })
export class DuaCategoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ type: 'uuid' })
  language_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => DuaCategory, (category) => category.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: DuaCategory;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: Language;
}