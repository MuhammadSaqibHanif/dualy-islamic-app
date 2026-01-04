import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private repository: Repository<Language>,
  ) {}

  async findByCode(code: string): Promise<Language | null> {
    return this.repository.findOne({ where: { code, is_active: true } });
  }

  async findAllActive(): Promise<Language[]> {
    return this.repository.find({
      where: { is_active: true },
      order: { display_order: 'ASC' },
    });
  }

  async getDefaultLanguage(): Promise<Language> {
    const english = await this.findByCode('en');
    if (english) {
      return english;
    }

    // Fallback to first active language
    const languages = await this.findAllActive();
    if (languages.length > 0) {
      return languages[0];
    }

    throw new Error('No active languages found');
  }

  async findAll(): Promise<Language[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Language | null> {
    return this.repository.findOne({ where: { id } });
  }
}