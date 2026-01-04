import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@base/entity/base.entity';
import { DuaCategoryTranslation } from './dua-category-translation.entity';
import { Dua } from './dua.entity';

@Entity('dua_categories')
export class DuaCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name_key: string;

  @Column({ type: 'text', nullable: true })
  icon_url: string;

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color_hex: string;

  @Column({ type: 'integer', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => DuaCategoryTranslation, (translation) => translation.category)
  translations: DuaCategoryTranslation[];

  @OneToMany(() => Dua, (dua) => dua.category)
  duas: Dua[];
}