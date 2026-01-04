import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DuaCategory } from './entities/dua-category.entity';
import { DuaCategoryTranslation } from './entities/dua-category-translation.entity';

@ApiTags('Dua Categories')
@Controller('dua-categories')
export class DuaCategoriesController {
  constructor(
    @InjectRepository(DuaCategory)
    private duaCategoriesRepository: Repository<DuaCategory>,
    @InjectRepository(DuaCategoryTranslation)
    private translationsRepository: Repository<DuaCategoryTranslation>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all dua categories' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('limit') limit?: number) {
    const categories = await this.duaCategoriesRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC' },
      take: limit || 100,
    });

    const categoriesWithTranslations = await Promise.all(
      categories.map(async (category) => {
        const translations = await this.translationsRepository.find({
          where: { category_id: category.id },
          relations: ['language'],
        });
        return { ...category, translations };
      }),
    );

    return {
      statusCode: 200,
      message: 'Success',
      data: {
        data: categoriesWithTranslations,
        meta: {
          total: categoriesWithTranslations.length,
          page: 1,
          limit: limit || 100,
          totalPages: 1,
        },
      },
    };
  }
}
