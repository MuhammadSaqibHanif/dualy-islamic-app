import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DuaCategoriesService } from '../services/dua-categories.service';

@ApiTags('Dua Categories')
@Controller('dua-categories')
export class DuaCategoriesController {
  constructor(private readonly duaCategoriesService: DuaCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all dua categories' })
  @ApiQuery({ name: 'language', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('language') language?: string,
    @Query('limit') limit?: number,
  ) {
    return await this.duaCategoriesService.findAll();
  }
}
