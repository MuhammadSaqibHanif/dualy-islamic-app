import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DuasController } from './controllers/duas.controller';
import { DuaCategoriesController } from './controllers/dua-categories.controller';
import { DuasService } from './services/duas.service';
import { DuaCategoriesService } from './services/dua-categories.service';
import { Dua } from './entities/dua.entity';
import { DuaCategory } from './entities/dua-category.entity';
import { DuaTranslation } from './entities/dua-translation.entity';
import { DuaCategoryTranslation } from './entities/dua-category-translation.entity';
import { UserFavoriteDua } from './entities/user-favorite-dua.entity';
import { LanguagesModule } from '@modules/languages/languages.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dua,
      DuaCategory,
      DuaTranslation,
      DuaCategoryTranslation,
      UserFavoriteDua,
    ]),
    LanguagesModule,
    UsersModule,
  ],
  controllers: [DuasController, DuaCategoriesController],
  providers: [DuasService, DuaCategoriesService],
  exports: [DuasService, DuaCategoriesService],
})
export class DuasModule {}
