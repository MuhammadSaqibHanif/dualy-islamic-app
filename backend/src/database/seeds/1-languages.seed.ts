import { DataSource } from 'typeorm';
import { Language } from '@modules/languages/entities/language.entity';

export async function seedLanguages(dataSource: DataSource) {
  const languageRepository = dataSource.getRepository(Language);

  const languages = [
    {
      code: 'en',
      name: 'English',
      native_name: 'English',
      direction: 'ltr',
      is_active: true,
      display_order: 1,
    },
    {
      code: 'ar',
      name: 'Arabic',
      native_name: 'العربية',
      direction: 'rtl',
      is_active: true,
      display_order: 2,
    },
    {
      code: 'ur',
      name: 'Urdu',
      native_name: 'اردو',
      direction: 'rtl',
      is_active: true,
      display_order: 3,
    },
  ];

  for (const lang of languages) {
    const existing = await languageRepository.findOne({ where: { code: lang.code } });
    if (!existing) {
      await languageRepository.save(languageRepository.create(lang));
      console.log(`✅ Seeded language: ${lang.name}`);
    }
  }
}