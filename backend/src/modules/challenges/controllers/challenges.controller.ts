import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ChallengesService } from '../services/challenges.service';
import { QueryChallengesDto, SubmitDhikrProgressDto } from '../dto';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all challenges' })
  async getAllChallenges(@Query() query: QueryChallengesDto) {
    return this.challengesService.findAllWithTranslations(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get challenge by ID' })
  async getChallenge(@Param('id') id: string, @Query('language') language?: string) {
    return this.challengesService.findOneWithTranslations(id, language);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/join')
  @ApiOperation({ summary: 'Join a challenge' })
  async joinChallenge(@CurrentUser() user, @Param('id') id: string) {
    return this.challengesService.joinChallenge(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/progress')
  @ApiOperation({ summary: 'Submit dhikr progress' })
  async submitProgress(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() submitDto: SubmitDhikrProgressDto,
  ) {
    return this.challengesService.submitProgress(user.id, id, submitDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/my-progress')
  @ApiOperation({ summary: 'Get my progress for a challenge' })
  async getMyProgress(@CurrentUser() user, @Param('id') id: string) {
    return this.challengesService.getUserProgress(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my/active')
  @ApiOperation({ summary: 'Get my active challenges' })
  async getMyActiveChallenges(@CurrentUser() user) {
    return this.challengesService.getUserActiveChallenges(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my/completed')
  @ApiOperation({ summary: 'Get my completed challenges' })
  async getMyCompletedChallenges(@CurrentUser() user, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.challengesService.getUserCompletedChallenges(user.id, page, limit);
  }

  @Public()
  @Get(':id/collaborative-stats')
  @ApiOperation({ summary: 'Get collaborative challenge stats' })
  async getCollaborativeStats(@Param('id') id: string) {
    return this.challengesService.getCollaborativeStats(id);
  }
}