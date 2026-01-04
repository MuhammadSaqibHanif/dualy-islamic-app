import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from '@config/database/typeorm.config';
import { seedLanguages } from './1-languages.seed';
import { seedAdmin } from './2-admin.seed';
import { seedDuaCategories } from './3-dua-categories.seed';
import { seedDuas } from './4-duas.seed';
import { seedChallenges } from './5-challenges.seed';

config();

const dataSource = new DataSource(typeOrmConfig);

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await dataSource.initialize();
    console.log('✅ Database connected\n');

    console.log('📚 Seeding languages...');
    await seedLanguages(dataSource);

    console.log('\n👨‍💼 Seeding admin user...');
    await seedAdmin(dataSource);

    console.log('\n📂 Seeding dua categories...');
    await seedDuaCategories(dataSource);

    console.log('\n🤲 Seeding duas...');
    await seedDuas(dataSource);

    console.log('\n🎯 Seeding challenges...');
    await seedChallenges(dataSource);

    console.log('\n✨ Seeding completed successfully!');

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();