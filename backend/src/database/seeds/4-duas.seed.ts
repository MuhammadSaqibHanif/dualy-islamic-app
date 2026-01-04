import { DataSource } from 'typeorm';
import { Dua } from '@modules/duas/entities/dua.entity';
import { DuaTranslation } from '@modules/duas/entities/dua-translation.entity';
import { DuaCategory } from '@modules/duas/entities/dua-category.entity';
import { Language } from '@modules/languages/entities/language.entity';

export async function seedDuas(dataSource: DataSource) {
  const duaRepository = dataSource.getRepository(Dua);
  const translationRepository = dataSource.getRepository(DuaTranslation);
  const categoryRepository = dataSource.getRepository(DuaCategory);
  const languageRepository = dataSource.getRepository(Language);

  const languages = await languageRepository.find();
  const enLang = languages.find(l => l.code === 'en');
  const arLang = languages.find(l => l.code === 'ar');
  const urLang = languages.find(l => l.code === 'ur');

  const categories = await categoryRepository.find();
  const morningCat = categories.find(c => c.name_key === 'morning_duas');
  const eveningCat = categories.find(c => c.name_key === 'evening_duas');
  const protectionCat = categories.find(c => c.name_key === 'protection_duas');
  const sleepCat = categories.find(c => c.name_key === 'sleep_duas');
  const gratitudeCat = categories.find(c => c.name_key === 'gratitude_duas');

  const duas = [
    // Morning Duas
    {
      category: morningCat,
      arabic_text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
      transliteration: 'Asbahnaa wa-asbahal-mulku lillaah',
      translations: [
        { lang: enLang, translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah', benefits: 'Protection and blessings for the day' },
        { lang: arLang, translation: 'أصبحنا وأصبح الملك لله', benefits: 'الحماية والبركات لليوم' },
        { lang: urLang, translation: 'ہم نے صبح کی اور تمام بادشاہی اللہ کی ہے', benefits: 'دن کے لیے حفاظت اور برکتیں' },
      ],
      recitation_count: 1,
      display_order: 1,
    },
    {
      category: morningCat,
      arabic_text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
      transliteration: 'Allahumma bika asbahnaa wa-bika amsaynaa',
      translations: [
        { lang: enLang, translation: 'O Allah, by You we have reached the morning and by You we have reached the evening', benefits: 'Acknowledging Allah in all aspects of life' },
        { lang: arLang, translation: 'اللهم بك أصبحنا وبك أمسينا', benefits: 'الاعتراف بالله في جميع جوانب الحياة' },
        { lang: urLang, translation: 'اے اللہ! تیری مدد سے ہم نے صبح کی', benefits: 'زندگی کے تمام پہلوؤں میں اللہ کو تسلیم کرنا' },
      ],
      recitation_count: 1,
      display_order: 2,
    },
    {
      category: morningCat,
      arabic_text: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ',
      transliteration: 'Asbahnaa alaa fitratil-Islaam',
      translations: [
        { lang: enLang, translation: 'We have entered upon the natural religion of Islam', benefits: 'Renewal of faith every morning' },
        { lang: arLang, translation: 'أصبحنا على فطرة الإسلام', benefits: 'تجديد الإيمان كل صباح' },
        { lang: urLang, translation: 'ہم نے اسلام کی فطرت پر صبح کی', benefits: 'ہر صبح ایمان کی تجدید' },
      ],
      recitation_count: 1,
      display_order: 3,
    },
    // Evening Duas
    {
      category: eveningCat,
      arabic_text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
      transliteration: 'Amsaynaa wa-amsal-mulku lillaah',
      translations: [
        { lang: enLang, translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah', benefits: 'Evening protection and peace' },
        { lang: arLang, translation: 'أمسينا وأمسى الملك لله', benefits: 'حماية المساء والسلام' },
        { lang: urLang, translation: 'ہم نے شام کی اور تمام بادشاہی اللہ کی ہے', benefits: 'شام کی حفاظت اور امن' },
      ],
      recitation_count: 1,
      display_order: 1,
    },
    {
      category: eveningCat,
      arabic_text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا',
      transliteration: 'Allahumma bika amsaynaa wa-bika asbahnaa',
      translations: [
        { lang: enLang, translation: 'O Allah, by You we have reached the evening and by You we have reached the morning', benefits: 'Remembering Allah in evening time' },
        { lang: arLang, translation: 'اللهم بك أمسينا وبك أصبحنا', benefits: 'ذكر الله في المساء' },
        { lang: urLang, translation: 'اے اللہ! تیری مدد سے ہم نے شام کی', benefits: 'شام میں اللہ کو یاد کرنا' },
      ],
      recitation_count: 1,
      display_order: 2,
    },
    // Protection Duas
    {
      category: protectionCat,
      arabic_text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
      transliteration: 'Bismillaahil-lathee laa yadhurru ma\'as-mihi shay\'',
      translations: [
        { lang: enLang, translation: 'In the name of Allah with whose name nothing is harmed', benefits: 'Protection from all harm' },
        { lang: arLang, translation: 'بسم الله الذي لا يضر مع اسمه شيء', benefits: 'الحماية من كل ضرر' },
        { lang: urLang, translation: 'اللہ کے نام سے جس کے نام کے ساتھ کوئی چیز نقصان نہیں دیتی', benefits: 'تمام نقصان سے حفاظت' },
      ],
      recitation_count: 3,
      display_order: 1,
    },
    {
      category: protectionCat,
      arabic_text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'A\'oothu bikalimaatil-laahit-taammaati min sharri maa khalaq',
      translations: [
        { lang: enLang, translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created', benefits: 'Protection from evil and harm' },
        { lang: arLang, translation: 'أعوذ بكلمات الله التامات من شر ما خلق', benefits: 'الحماية من الشر والضرر' },
        { lang: urLang, translation: 'میں اللہ کے کامل کلمات کی پناہ مانگتا ہوں', benefits: 'شر اور نقصان سے حفاظت' },
      ],
      recitation_count: 3,
      display_order: 2,
    },
    // Sleep Duas  
    {
      category: sleepCat,
      arabic_text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: 'Bismika Allaahumma amootu wa-ahyaa',
      translations: [
        { lang: enLang, translation: 'In Your name O Allah, I die and I live', benefits: 'Peaceful sleep and protection' },
        { lang: arLang, translation: 'باسمك اللهم أموت وأحيا', benefits: 'نوم هادئ وحماية' },
        { lang: urLang, translation: 'اے اللہ تیرے نام سے میں مرتا اور جیتا ہوں', benefits: 'پرسکون نیند اور حفاظت' },
      ],
      recitation_count: 1,
      display_order: 1,
    },
    // Gratitude Duas
    {
      category: gratitudeCat,
      arabic_text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Alhamdu lillaahi Rabbil-\'aalameen',
      translations: [
        { lang: enLang, translation: 'All praise is due to Allah, Lord of the worlds', benefits: 'Expressing gratitude to Allah' },
        { lang: arLang, translation: 'الحمد لله رب العالمين', benefits: 'التعبير عن الامتنان لله' },
        { lang: urLang, translation: 'تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے', benefits: 'اللہ کا شکر ادا کرنا' },
      ],
      recitation_count: 100,
      display_order: 1,
      is_featured: true,
    },
  ];

  for (let i = 0; i < duas.length; i++) {
    const duaData = duas[i];
    
    if (!duaData.category) continue;

    let dua = await duaRepository.findOne({
      where: { 
        category_id: duaData.category.id,
        display_order: duaData.display_order 
      },
    });

    if (!dua) {
      dua = duaRepository.create({
        category_id: duaData.category.id,
        arabic_text: duaData.arabic_text,
        transliteration: duaData.transliteration,
        recitation_count: duaData.recitation_count,
        display_order: duaData.display_order,
        is_active: true,
        is_featured: duaData.is_featured || false,
      });
      dua = await duaRepository.save(dua);
      console.log(`✅ Seeded dua #${i + 1} in ${duaData.category.name_key}`);
    }

    // Add translations
    for (const trans of duaData.translations) {
      if (trans.lang) {
        const existing = await translationRepository.findOne({
          where: { dua_id: dua.id, language_id: trans.lang.id },
        });

        if (!existing) {
          await translationRepository.save(translationRepository.create({
            dua_id: dua.id,
            language_id: trans.lang.id,
            translation: trans.translation,
            benefits: trans.benefits,
          }));
        }
      }
    }
  }
}