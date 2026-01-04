import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { BaseService } from '@base/service/base.service';
import { Dua } from '../entities/dua.entity';
import { DuaTranslation } from '../entities/dua-translation.entity';
import { UserFavoriteDua } from '../entities/user-favorite-dua.entity';
import { Language } from '@modules/languages/entities/language.entity';
import { CreateDuaDto, UpdateDuaDto, QueryDuasDto } from '../dto';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class DuasService extends BaseService<Dua> {
  constructor(
    @InjectRepository(Dua)
    protected repository: Repository<Dua>,
    @InjectRepository(DuaTranslation)
    private duaTranslationRepository: Repository<DuaTranslation>,
    @InjectRepository(UserFavoriteDua)
    private userFavoriteDuaRepository: Repository<UserFavoriteDua>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private usersService: UsersService,
  ) {
    super();
  }

  async findAllWithTranslations(queryDuasDto: QueryDuasDto, languageCode?: string) {
    const {
      category_id,
      is_featured,
      search,
      page = 1,
      limit = 10,
    } = queryDuasDto;

    const queryBuilder = this.repository
      .createQueryBuilder('dua')
      .leftJoinAndSelect('dua.category', 'category')
      .leftJoinAndSelect('dua.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .where('dua.is_active = :is_active', { is_active: true })
      .andWhere('dua.deleted_at IS NULL');

    if (category_id) {
      queryBuilder.andWhere('dua.category_id = :category_id', { category_id });
    }

    if (is_featured !== undefined) {
      queryBuilder.andWhere('dua.is_featured = :is_featured', { is_featured });
    }

    if (search) {
      queryBuilder.andWhere(
        '(dua.arabic_text ILIKE :search OR dua.transliteration ILIKE :search OR translations.translation ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (languageCode) {
      queryBuilder.andWhere('language.code = :languageCode', { languageCode });
    }

    queryBuilder.orderBy('dua.display_order', 'ASC').addOrderBy('dua.created_at', 'DESC');

    const skip = (page - 1) * limit;
    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneWithTranslations(id: string, languageCode?: string) {
    const queryBuilder = this.repository
      .createQueryBuilder('dua')
      .leftJoinAndSelect('dua.category', 'category')
      .leftJoinAndSelect('dua.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .where('dua.id = :id', { id })
      .andWhere('dua.deleted_at IS NULL');

    if (languageCode) {
      queryBuilder.andWhere('language.code = :languageCode', { languageCode });
    }

    const dua = await queryBuilder.getOne();

    if (!dua) {
      throw new NotFoundException('Dua not found');
    }

    return dua;
  }

  async createDua(createDuaDto: CreateDuaDto) {
    // Create dua
    const dua = this.repository.create({
      category_id: createDuaDto.category_id,
      reference: createDuaDto.reference,
      reference_type: createDuaDto.reference_type,
      arabic_text: createDuaDto.arabic_text,
      transliteration: createDuaDto.transliteration,
      audio_url: createDuaDto.audio_url,
      audio_duration_seconds: createDuaDto.audio_duration_seconds,
      recitation_count: createDuaDto.recitation_count || 1,
      benefits_key: createDuaDto.benefits_key,
      display_order: createDuaDto.display_order || 0,
      is_active: createDuaDto.is_active !== undefined ? createDuaDto.is_active : true,
      is_featured: createDuaDto.is_featured || false,
    });

    const savedDua = await this.repository.save(dua);

    // Create translations
    if (createDuaDto.translations && createDuaDto.translations.length > 0) {
      for (const translationDto of createDuaDto.translations) {
        const language = await this.languageRepository.findOne({
          where: { code: translationDto.language_code },
        });

        if (language) {
          const translation = this.duaTranslationRepository.create({
            dua_id: savedDua.id,
            language_id: language.id,
            translation: translationDto.translation,
            benefits: translationDto.benefits,
            translator_name: translationDto.translator_name,
          });

          await this.duaTranslationRepository.save(translation);
        }
      }
    }

    return this.findById(savedDua.id, ['translations', 'translations.language', 'category']);
  }

  async updateDua(id: string, updateDuaDto: UpdateDuaDto) {
    const dua = await this.findByIdOrFail(id);

    // Update dua fields
    if (updateDuaDto.category_id !== undefined) dua.category_id = updateDuaDto.category_id;
    if (updateDuaDto.reference !== undefined) dua.reference = updateDuaDto.reference;
    if (updateDuaDto.reference_type !== undefined) dua.reference_type = updateDuaDto.reference_type;
    if (updateDuaDto.arabic_text !== undefined) dua.arabic_text = updateDuaDto.arabic_text;
    if (updateDuaDto.transliteration !== undefined) dua.transliteration = updateDuaDto.transliteration;
    if (updateDuaDto.audio_url !== undefined) dua.audio_url = updateDuaDto.audio_url;
    if (updateDuaDto.audio_duration_seconds !== undefined) dua.audio_duration_seconds = updateDuaDto.audio_duration_seconds;
    if (updateDuaDto.recitation_count !== undefined) dua.recitation_count = updateDuaDto.recitation_count;
    if (updateDuaDto.benefits_key !== undefined) dua.benefits_key = updateDuaDto.benefits_key;
    if (updateDuaDto.display_order !== undefined) dua.display_order = updateDuaDto.display_order;
    if (updateDuaDto.is_active !== undefined) dua.is_active = updateDuaDto.is_active;
    if (updateDuaDto.is_featured !== undefined) dua.is_featured = updateDuaDto.is_featured;

    await this.repository.save(dua);

    // Update translations if provided
    if (updateDuaDto.translations && updateDuaDto.translations.length > 0) {
      for (const translationDto of updateDuaDto.translations) {
        const language = await this.languageRepository.findOne({
          where: { code: translationDto.language_code },
        });

        if (language) {
          let translation = await this.duaTranslationRepository.findOne({
            where: { dua_id: id, language_id: language.id },
          });

          if (translation) {
            // Update existing translation
            translation.translation = translationDto.translation;
            translation.benefits = translationDto.benefits;
            translation.translator_name = translationDto.translator_name;
          } else {
            // Create new translation
            translation = this.duaTranslationRepository.create({
              dua_id: id,
              language_id: language.id,
              translation: translationDto.translation,
              benefits: translationDto.benefits,
              translator_name: translationDto.translator_name,
            });
          }

          await this.duaTranslationRepository.save(translation);
        }
      }
    }

    return this.findById(id, ['translations', 'translations.language', 'category']);
  }

  async markDuaAsRead(userId: string, duaId: string) {
    const dua = await this.findByIdOrFail(duaId);
    
    // Increment user stats
    await this.usersService.incrementDuasRead(userId);

    return { message: 'Dua marked as read' };
  }

  // User Favorites
  async addToFavorites(userId: string, duaId: string) {
    const dua = await this.findByIdOrFail(duaId);

    const existing = await this.userFavoriteDuaRepository.findOne({
      where: { user_id: userId, dua_id: duaId },
    });

    if (existing) {
      return { message: 'Dua already in favorites' };
    }

    const favorite = this.userFavoriteDuaRepository.create({
      user_id: userId,
      dua_id: duaId,
    });

    await this.userFavoriteDuaRepository.save(favorite);

    return { message: 'Dua added to favorites' };
  }

  async removeFromFavorites(userId: string, duaId: string) {
    await this.userFavoriteDuaRepository.delete({
      user_id: userId,
      dua_id: duaId,
    });

    return { message: 'Dua removed from favorites' };
  }

  async getUserFavorites(userId: string, page: number = 1, limit: number = 10) {
    const [favorites, total] = await this.userFavoriteDuaRepository.findAndCount({
      where: { user_id: userId },
      relations: ['dua', 'dua.translations', 'dua.translations.language', 'dua.category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: favorites.map(fav => fav.dua),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}