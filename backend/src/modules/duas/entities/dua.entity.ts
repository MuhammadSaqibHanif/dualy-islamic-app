import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@base/entity/base.entity';
import { DuaCategory } from './dua-category.entity';
import { DuaTranslation } from './dua-translation.entity';

@Entity('duas')
export class Dua extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  reference_type: string;

  @Column({ type: 'text' })
  arabic_text: string;

  @Column({ type: 'text', nullable: true })
  transliteration: string;

  @Column({ type: 'text', nullable: true })
  audio_url: string;

  @Column({ type: 'integer', nullable: true })
  audio_duration_seconds: number;

  @Column({ type: 'integer', default: 1 })
  recitation_count: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  benefits_key: string;

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @ManyToOne(() => DuaCategory, (category) => category.duas, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: DuaCategory;

  @OneToMany(() => DuaTranslation, (translation) => translation.dua)
  translations: DuaTranslation[];
}