import { DataSource } from 'typeorm';
import { DhikrChallenge, ChallengeType, ChallengeDifficulty, RewardAssignment } from '@modules/challenges/entities/dhikr-challenge.entity';
import { DhikrChallengeTranslation } from '@modules/challenges/entities/dhikr-challenge-translation.entity';
import { Language } from '@modules/languages/entities/language.entity';

export async function seedChallenges(dataSource: DataSource) {
  const challengeRepository = dataSource.getRepository(DhikrChallenge);
  const translationRepository = dataSource.getRepository(DhikrChallengeTranslation);
  const languageRepository = dataSource.getRepository(Language);

  const languages = await languageRepository.find();
  const enLang = languages.find(l => l.code === 'en');
  const arLang = languages.find(l => l.code === 'ar');
  const urLang = languages.find(l => l.code === 'ur');

  const challenges = [
    // Singular Challenges
    {
      title_key: 'subhanallah_100',
      type: ChallengeType.SINGULAR,
      difficulty: ChallengeDifficulty.EASY,
      target_count: 100,
      duration_days: 7,
      arabic_text: 'سُبْحَانَ اللَّهِ',
      transliteration: 'Subhanallah',
      reward_points: 50,
      reward_assignment: RewardAssignment.ON_CHALLENGE_COMPLETE,
      display_order: 1,
      translations: [
        { lang: enLang, title: 'Subhanallah 100 Times', description: 'Recite Subhanallah 100 times', dhikr_text_translation: 'Glory be to Allah', benefits: 'Purifies the heart and tongue' },
        { lang: arLang, title: 'سبحان الله 100 مرة', description: 'قل سبحان الله 100 مرة', dhikr_text_translation: 'سبحان الله', benefits: 'ينقي القلب واللسان' },
        { lang: urLang, title: 'سبحان اللہ 100 مرتبہ', description: 'سبحان اللہ 100 مرتبہ پڑھیں', dhikr_text_translation: 'اللہ پاک ہے', benefits: 'دل اور زبان کو پاک کرتا ہے' },
      ],
    },
    {
      title_key: 'alhamdulillah_100',
      type: ChallengeType.SINGULAR,
      difficulty: ChallengeDifficulty.EASY,
      target_count: 100,
      duration_days: 7,
      arabic_text: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Alhamdulillah',
      reward_points: 50,
      reward_assignment: RewardAssignment.ON_CHALLENGE_COMPLETE,
      display_order: 2,
      translations: [
        { lang: enLang, title: 'Alhamdulillah 100 Times', description: 'Recite Alhamdulillah 100 times', dhikr_text_translation: 'Praise be to Allah', benefits: 'Increases gratitude and blessings' },
        { lang: arLang, title: 'الحمد لله 100 مرة', description: 'قل الحمد لله 100 مرة', dhikr_text_translation: 'الحمد لله', benefits: 'يزيد الامتنان والبركات' },
        { lang: urLang, title: 'الحمد للہ 100 مرتبہ', description: 'الحمد للہ 100 مرتبہ پڑھیں', dhikr_text_translation: 'تمام تعریفیں اللہ کے لیے', benefits: 'شکر اور برکتیں بڑھاتا ہے' },
      ],
    },
    {
      title_key: 'istighfar_300',
      type: ChallengeType.SINGULAR,
      difficulty: ChallengeDifficulty.MEDIUM,
      target_count: 300,
      duration_days: 14,
      arabic_text: 'أَسْتَغْفِرُ اللَّهَ',
      transliteration: 'Astaghfirullah',
      reward_points: 100,
      reward_assignment: RewardAssignment.ON_CHALLENGE_COMPLETE,
      display_order: 3,
      translations: [
        { lang: enLang, title: 'Istighfar 300 Times', description: 'Seek forgiveness 300 times', dhikr_text_translation: 'I seek forgiveness from Allah', benefits: 'Cleanses sins and brings peace' },
        { lang: arLang, title: 'الاستغفار 300 مرة', description: 'اطلب المغفرة 300 مرة', dhikr_text_translation: 'أستغفر الله', benefits: 'ينظف الذنوب ويجلب السلام' },
        { lang: urLang, title: 'استغفار 300 مرتبہ', description: '300 مرتبہ مغفرت مانگیں', dhikr_text_translation: 'میں اللہ سے معافی مانگتا ہوں', benefits: 'گناہوں کو صاف کرتا اور امن لاتا ہے' },
      ],
    },
    {
      title_key: 'tasbih_tahmid_1000',
      type: ChallengeType.SINGULAR,
      difficulty: ChallengeDifficulty.HARD,
      target_count: 1000,
      duration_days: 30,
      arabic_text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ',
      transliteration: 'Subhanallah wal-Hamdulillah',
      reward_points: 200,
      reward_assignment: RewardAssignment.PER_TAP,
      display_order: 4,
      translations: [
        { lang: enLang, title: 'Tasbih & Tahmid 1000 Times', description: 'Recite 1000 times in 30 days', dhikr_text_translation: 'Glory be to Allah and praise be to Allah', benefits: 'Double rewards and blessings' },
        { lang: arLang, title: 'التسبيح والتحميد 1000 مرة', description: 'اقرأ 1000 مرة في 30 يومًا', dhikr_text_translation: 'سبحان الله والحمد لله', benefits: 'مكافآت وبركات مضاعفة' },
        { lang: urLang, title: 'تسبیح اور تحمید 1000 مرتبہ', description: '30 دنوں میں 1000 مرتبہ پڑھیں', dhikr_text_translation: 'اللہ پاک ہے اور تمام تعریفیں اللہ کے لیے', benefits: 'دوہرے اجر اور برکتیں' },
      ],
    },
    {
      title_key: 'durood_sharif_500',
      type: ChallengeType.SINGULAR,
      difficulty: ChallengeDifficulty.MEDIUM,
      target_count: 500,
      duration_days: 21,
      arabic_text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
      transliteration: 'Allahumma salli ala Muhammad',
      reward_points: 150,
      reward_assignment: RewardAssignment.ON_CHALLENGE_COMPLETE,
      display_order: 5,
      translations: [
        { lang: enLang, title: 'Durood Sharif 500 Times', description: 'Send blessings upon Prophet 500 times', dhikr_text_translation: 'O Allah, send blessings upon Muhammad', benefits: 'Brings blessings and nearness to Prophet' },
        { lang: arLang, title: 'الصلاة على النبي 500 مرة', description: 'صل على النبي 500 مرة', dhikr_text_translation: 'اللهم صل على محمد', benefits: 'يجلب البركات والقرب من النبي' },
        { lang: urLang, title: 'درود شریف 500 مرتبہ', description: 'نبی پر 500 مرتبہ درود بھیجیں', dhikr_text_translation: 'اے اللہ محمد پر رحمتیں نازل فرما', benefits: 'برکتیں اور نبی سے قربت لاتا ہے' },
      ],
    },
    // Collaborative Challenges
    {
      title_key: 'global_tasbih_million',
      type: ChallengeType.COLLABORATIVE,
      difficulty: ChallengeDifficulty.EASY,
      target_count: 1000000,
      duration_days: 90,
      arabic_text: 'سُبْحَانَ اللَّهِ',
      transliteration: 'Subhanallah',
      reward_points: 10,
      reward_assignment: RewardAssignment.PER_TAP,
      display_order: 6,
      translations: [
        { lang: enLang, title: 'Global Tasbih - 1 Million', description: 'Reach 1 million together!', dhikr_text_translation: 'Glory be to Allah', benefits: 'United in worship' },
        { lang: arLang, title: 'التسبيح العالمي - مليون', description: 'الوصول إلى مليون معًا!', dhikr_text_translation: 'سبحان الله', benefits: 'متحدون في العبادة' },
        { lang: urLang, title: 'عالمی تسبیح - 10 لاکھ', description: 'مل کر 10 لاکھ تک پہنچیں!', dhikr_text_translation: 'اللہ پاک ہے', benefits: 'عبادت میں متحد' },
      ],
    },
    {
      title_key: 'ramadan_quran_reading',
      type: ChallengeType.COLLABORATIVE,
      difficulty: ChallengeDifficulty.MEDIUM,
      target_count: 100000,
      duration_days: 30,
      arabic_text: 'قِرَاءَةُ الْقُرْآنِ',
      transliteration: 'Qira\'atul Quran',
      reward_points: 20,
      reward_assignment: RewardAssignment.PER_TAP,
      display_order: 7,
      translations: [
        { lang: enLang, title: 'Ramadan Quran Reading', description: 'Read Quran together in Ramadan', dhikr_text_translation: 'Quran Recitation', benefits: 'Collective spiritual growth' },
        { lang: arLang, title: 'قراءة القرآن في رمضان', description: 'اقرأ القرآن معًا في رمضان', dhikr_text_translation: 'قراءة القرآن', benefits: 'نمو روحي جماعي' },
        { lang: urLang, title: 'رمضان قرآن پڑھنا', description: 'رمضان میں مل کر قرآن پڑھیں', dhikr_text_translation: 'قرآن کی تلاوت', benefits: 'اجتماعی روحانی ترقی' },
      ],
    },
    {
      title_key: 'global_salawat',
      type: ChallengeType.COLLABORATIVE,
      difficulty: ChallengeDifficulty.HARD,
      target_count: 5000000,
      duration_days: 365,
      arabic_text: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
      transliteration: 'Sallallahu alayhi wa sallam',
      reward_points: 5,
      reward_assignment: RewardAssignment.PER_TAP,
      display_order: 8,
      translations: [
        { lang: enLang, title: 'Global Salawat - 5 Million', description: 'Yearly goal for blessings', dhikr_text_translation: 'Peace and blessings upon him', benefits: 'Continuous rewards' },
        { lang: arLang, title: 'الصلاة العالمية - 5 مليون', description: 'الهدف السنوي للبركات', dhikr_text_translation: 'صلى الله عليه وسلم', benefits: 'مكافآت مستمرة' },
        { lang: urLang, title: 'عالمی صلوٰۃ - 50 لاکھ', description: 'برکتوں کا سالانہ ہدف', dhikr_text_translation: 'صلی اللہ علیہ وسلم', benefits: 'مسلسل اجر' },
      ],
    },
  ];

  for (let i = 0; i < challenges.length; i++) {
    const chalData = challenges[i];

    let challenge = await challengeRepository.findOne({
      where: { title_key: chalData.title_key },
    });

    if (!challenge) {
      challenge = challengeRepository.create({
        title_key: chalData.title_key,
        type: chalData.type,
        difficulty: chalData.difficulty,
        target_count: chalData.target_count,
        duration_days: chalData.duration_days,
        arabic_text: chalData.arabic_text,
        transliteration: chalData.transliteration,
        reward_points: chalData.reward_points,
        reward_assignment: chalData.reward_assignment,
        display_order: chalData.display_order,
        is_active: true,
      });
      challenge = await challengeRepository.save(challenge);
      console.log(`✅ Seeded challenge: ${chalData.title_key}`);
    }

    // Add translations
    for (const trans of chalData.translations) {
      if (trans.lang) {
        const existing = await translationRepository.findOne({
          where: { challenge_id: challenge.id, language_id: trans.lang.id },
        });

        if (!existing) {
          await translationRepository.save(translationRepository.create({
            challenge_id: challenge.id,
            language_id: trans.lang.id,
            title: trans.title,
            description: trans.description,
            dhikr_text_translation: trans.dhikr_text_translation,
            benefits: trans.benefits,
          }));
        }
      }
    }
  }
}