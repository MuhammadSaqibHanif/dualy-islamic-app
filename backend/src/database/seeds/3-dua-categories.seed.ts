import { DataSource } from 'typeorm';
import { DuaCategory } from '@modules/duas/entities/dua-category.entity';
import { DuaCategoryTranslation } from '@modules/duas/entities/dua-category-translation.entity';
import { Language } from '@modules/languages/entities/language.entity';

export async function seedDuaCategories(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(DuaCategory);
  const translationRepository = dataSource.getRepository(DuaCategoryTranslation);
  const languageRepository = dataSource.getRepository(Language);

  const languages = await languageRepository.find();
  const enLang = languages.find(l => l.code === 'en');
  const arLang = languages.find(l => l.code === 'ar');
  const urLang = languages.find(l => l.code === 'ur');

  const categories = [
    {
      name_key: 'morning_duas',
      icon_url: '/icons/sunrise.png',
      color_hex: '#FFA726',
      display_order: 1,
      translations: [
        { lang: enLang, name: 'Morning Duas', description: 'Supplications for the morning' },
        { lang: arLang, name: 'أدعية الصباح', description: 'الأدعية للصباح' },
        { lang: urLang, name: 'صبح کی دعائیں', description: 'صبح کے لیے دعائیں' },
      ],
    },
    {
      name_key: 'evening_duas',
      icon_url: '/icons/sunset.png',
      color_hex: '#5C6BC0',
      display_order: 2,
      translations: [
        { lang: enLang, name: 'Evening Duas', description: 'Supplications for the evening' },
        { lang: arLang, name: 'أدعية المساء', description: 'الأدعية للمساء' },
        { lang: urLang, name: 'شام کی دعائیں', description: 'شام کے لیے دعائیں' },
      ],
    },
    {
      name_key: 'protection_duas',
      icon_url: '/icons/shield.png',
      color_hex: '#66BB6A',
      display_order: 3,
      translations: [
        { lang: enLang, name: 'Protection', description: 'Duas for protection and safety' },
        { lang: arLang, name: 'الحماية', description: 'أدعية للحماية والأمان' },
        { lang: urLang, name: 'حفاظت', description: 'حفاظت اور سلامتی کے لیے دعائیں' },
      ],
    },
    {
      name_key: 'sleep_duas',
      icon_url: '/icons/moon.png',
      color_hex: '#7E57C2',
      display_order: 4,
      translations: [
        { lang: enLang, name: 'Sleep & Rest', description: 'Duas before sleeping' },
        { lang: arLang, name: 'النوم والراحة', description: 'أدعية قبل النوم' },
        { lang: urLang, name: 'نیند اور آرام', description: 'سونے سے پہلے کی دعائیں' },
      ],
    },
    {
      name_key: 'gratitude_duas',
      icon_url: '/icons/heart.png',
      color_hex: '#EF5350',
      display_order: 5,
      translations: [
        { lang: enLang, name: 'Gratitude', description: 'Duas of thankfulness' },
        { lang: arLang, name: 'الشكر', description: 'أدعية الشكر' },
        { lang: urLang, name: 'شکر', description: 'شکر گزاری کی دعائیں' },
      ],
    },
  ];

  for (const cat of categories) {
    let category = await categoryRepository.findOne({ where: { name_key: cat.name_key } });
    
    if (!category) {
      category = categoryRepository.create({
        name_key: cat.name_key,
        icon_url: cat.icon_url,
        color_hex: cat.color_hex,
        display_order: cat.display_order,
        is_active: true,
      });
      category = await categoryRepository.save(category);
      console.log(`✅ Seeded category: ${cat.name_key}`);
    }

    // Add translations
    for (const trans of cat.translations) {
      if (trans.lang) {
        const existing = await translationRepository.findOne({
          where: { category_id: category.id, language_id: trans.lang.id },
        });

        if (!existing) {
          await translationRepository.save(translationRepository.create({
            category_id: category.id,
            language_id: trans.lang.id,
            name: trans.name,
            description: trans.description,
          }));
        }
      }
    }
  }
}