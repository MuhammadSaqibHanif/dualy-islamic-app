import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Dua } from './dua.entity';

@Entity('user_favorite_duas')
@Index(['user_id', 'dua_id'], { unique: true })
export class UserFavoriteDua {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  dua_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Dua, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dua_id' })
  dua: Dua;
}