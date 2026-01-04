import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { LanguagesService } from './services/languages.service';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active languages' })
  async findAll() {
    return await this.languagesService.findAll();
  }

  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Get active languages' })
  async findActive() {
    return await this.languagesService.findAllActive();
  }
}
