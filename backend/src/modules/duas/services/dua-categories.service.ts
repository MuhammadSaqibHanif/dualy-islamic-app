import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@base/service/base.service';
import { DuaCategory } from '../entities/dua-category.entity';
import { DuaCategoryTranslation } from '../entities/dua-category-translation.entity';
import { Language } from '@modules/languages/entities/language.entity';
import { CreateDuaCategoryDto, UpdateDuaCategoryDto } from '../dto';

@Injectable()
export class DuaCategoriesService extends BaseService<DuaCategory> {
  constructor(
    @InjectRepository(DuaCategory)
    protected repository: Repository<DuaCategory>,
    @InjectRepository(DuaCategoryTranslation)
    private categoryTranslationRepository: Repository<DuaCategoryTranslation>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {
    super();
  }

  async findAllWithTranslations(languageCode?: string) {
    const queryBuilder = this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .where('category.is_active = :is_active', { is_active: true })
      .andWhere('category.deleted_at IS NULL');

    if (languageCode) {
      queryBuilder.andWhere('language.code = :languageCode', { languageCode });
    }

    queryBuilder.orderBy('category.display_order', 'ASC');

    return queryBuilder.getMany();
  }

  async createCategory(createCategoryDto: CreateDuaCategoryDto) {
    // Create category
    const category = this.repository.create({
      name_key: createCategoryDto.name_key,
      icon_url: createCategoryDto.icon_url,
      color_hex: createCategoryDto.color_hex || '#000000',
      display_order: createCategoryDto.display_order || 0,
      is_active: createCategoryDto.is_active !== undefined ? createCategoryDto.is_active : true,
    });

    const savedCategory = await this.repository.save(category);

    // Create translations
    if (createCategoryDto.translations && createCategoryDto.translations.length > 0) {
      for (const translationDto of createCategoryDto.translations) {
        const language = await this.languageRepository.findOne({
          where: { code: translationDto.language_code },
        });

        if (language) {
          const translation = this.categoryTranslationRepository.create({
            category_id: savedCategory.id,
            language_id: language.id,
            name: translationDto.name,
            description: translationDto.description,
          });

          await this.categoryTranslationRepository.save(translation);
        }
      }
    }

    return this.findById(savedCategory.id, ['translations', 'translations.language']);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateDuaCategoryDto) {
    const category = await this.findByIdOrFail(id);

    if (updateCategoryDto.name_key !== undefined) category.name_key = updateCategoryDto.name_key;
    if (updateCategoryDto.icon_url !== undefined) category.icon_url = updateCategoryDto.icon_url;
    if (updateCategoryDto.color_hex !== undefined) category.color_hex = updateCategoryDto.color_hex;
    if (updateCategoryDto.display_order !== undefined) category.display_order = updateCategoryDto.display_order;
    if (updateCategoryDto.is_active !== undefined) category.is_active = updateCategoryDto.is_active;

    await this.repository.save(category);

    // Update translations if provided
    if (updateCategoryDto.translations && updateCategoryDto.translations.length > 0) {
      for (const translationDto of updateCategoryDto.translations) {
        const language = await this.languageRepository.findOne({
          where: { code: translationDto.language_code },
        });

        if (language) {
          let translation = await this.categoryTranslationRepository.findOne({
            where: { category_id: id, language_id: language.id },
          });

          if (translation) {
            translation.name = translationDto.name;
            translation.description = translationDto.description;
          } else {
            translation = this.categoryTranslationRepository.create({
              category_id: id,
              language_id: language.id,
              name: translationDto.name,
              description: translationDto.description,
            });
          }

          await this.categoryTranslationRepository.save(translation);
        }
      }
    }

    return this.findById(id, ['translations', 'translations.language']);
  }
}