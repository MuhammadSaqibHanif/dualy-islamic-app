import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { AdminService } from '../services/admin.service';
import { DuasService } from '@modules/duas/services/duas.service';
import { DuaCategoriesService } from '@modules/duas/services/dua-categories.service';
import { ChallengesService } from '@modules/challenges/services/challenges.service';
import { AdminLoginDto, CreateAdminUserDto, UpdateAdminUserDto } from '../dto';
import { CreateDuaDto, UpdateDuaDto, CreateDuaCategoryDto, UpdateDuaCategoryDto } from '@modules/duas/dto';
import { CreateDhikrChallengeDto, UpdateDhikrChallengeDto } from '@modules/challenges/dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly duasService: DuasService,
    private readonly categoriesService: DuaCategoriesService,
    private readonly challengesService: ChallengesService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  async login(@Body() adminLoginDto: AdminLoginDto, @Req() req) {
    return this.adminService.login(adminLoginDto, req.ip);
  }

  // Dua Categories Management
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'content_moderator')
  @ApiBearerAuth()
  @Post('dua-categories')
  @ApiOperation({ summary: 'Create dua category' })
  async createCategory(@Body() createCategoryDto: CreateDuaCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'content_moderator')
  @ApiBearerAuth()
  @Patch('dua-categories/:id')
  @ApiOperation({ summary: 'Update dua category' })
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateDuaCategoryDto) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Delete('dua-categories/:id')
  @ApiOperation({ summary: 'Delete dua category' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

  // Duas Management
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'content_moderator')
  @ApiBearerAuth()
  @Post('duas')
  @ApiOperation({ summary: 'Create dua' })
  async createDua(@Body() createDuaDto: CreateDuaDto) {
    return this.duasService.createDua(createDuaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'content_moderator')
  @ApiBearerAuth()
  @Patch('duas/:id')
  @ApiOperation({ summary: 'Update dua' })
  async updateDua(@Param('id') id: string, @Body() updateDuaDto: UpdateDuaDto) {
    return this.duasService.updateDua(id, updateDuaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Delete('duas/:id')
  @ApiOperation({ summary: 'Delete dua' })
  async deleteDua(@Param('id') id: string) {
    return this.duasService.delete(id);
  }

  // Challenges Management
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'content_moderator')
  @ApiBearerAuth()
  @Post('challenges')
  @ApiOperation({ summary: 'Create challenge' })
  async createChallenge(@Body() createChallengeDto: CreateDhikrChallengeDto) {
    return this.challengesService.createChallenge(createChallengeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'content_moderator')
  @ApiBearerAuth()
  @Patch('challenges/:id')
  @ApiOperation({ summary: 'Update challenge' })
  async updateChallenge(@Param('id') id: string, @Body() updateChallengeDto: UpdateDhikrChallengeDto) {
    return this.challengesService.updateChallenge(id, updateChallengeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin')
  @ApiBearerAuth()
  @Delete('challenges/:id')
  @ApiOperation({ summary: 'Delete challenge' })
  async deleteChallenge(@Param('id') id: string) {
    return this.challengesService.delete(id);
  }
}