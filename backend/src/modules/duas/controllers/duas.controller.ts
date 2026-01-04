import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { DuasService } from '../services/duas.service';
import { DuaCategoriesService } from '../services/dua-categories.service';
import { CreateDuaDto, UpdateDuaDto, QueryDuasDto, CreateDuaCategoryDto, UpdateDuaCategoryDto } from '../dto';

@ApiTags('Duas')
@Controller('duas')
export class DuasController {
  constructor(
    private readonly duasService: DuasService,
    private readonly categoriesService: DuaCategoriesService,
  ) {}

  // Categories
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all dua categories' })
  @ApiQuery({ name: 'language', required: false })
  async getCategories(@Query('language') language?: string) {
    return this.categoriesService.findAllWithTranslations(language);
  }

  @Public()
  @Get('categories/:id')
  @ApiOperation({ summary: 'Get dua category by ID' })
  async getCategory(@Param('id') id: string) {
    return this.categoriesService.findById(id, ['translations']);
  }

  // Duas
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all duas' })
  async getAllDuas(@Query() query: QueryDuasDto) {
    return this.duasService.findAllWithTranslations(query, query.language);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get dua by ID' })
  @ApiQuery({ name: 'language', required: false })
  async getDua(@Param('id') id: string, @Query('language') language?: string) {
    return this.duasService.findOneWithTranslations(id, language);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/read')
  @ApiOperation({ summary: 'Mark dua as read' })
  async markAsRead(@CurrentUser() user, @Param('id') id: string) {
    return this.duasService.markDuaAsRead(user.id, id);
  }

  // Favorites
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('favorites/my')
  @ApiOperation({ summary: 'Get user favorite duas' })
  async getFavorites(@CurrentUser() user, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.duasService.getUserFavorites(user.id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/favorite')
  @ApiOperation({ summary: 'Add dua to favorites' })
  async addToFavorites(@CurrentUser() user, @Param('id') id: string) {
    return this.duasService.addToFavorites(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/favorite')
  @ApiOperation({ summary: 'Remove dua from favorites' })
  async removeFromFavorites(@CurrentUser() user, @Param('id') id: string) {
    return this.duasService.removeFromFavorites(user.id, id);
  }
}