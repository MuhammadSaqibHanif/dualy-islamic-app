import { Controller, Get, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@CurrentUser() user, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  async getStats(@CurrentUser() user) {
    return this.usersService.getUserStats(user.id);
  }

  @Get('me/activity')
  @ApiOperation({ summary: 'Get user daily activity' })
  async getDailyActivity(@CurrentUser() user, @Query('days') days?: number) {
    return this.usersService.getDailyActivity(user.id, days ? parseInt(days.toString()) : 7);
  }
}