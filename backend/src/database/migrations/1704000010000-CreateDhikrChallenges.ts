import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDhikrChallenges1704000010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types
    await queryRunner.query(`
      CREATE TYPE challenge_type AS ENUM ('singular', 'collaborative');
    `);
    await queryRunner.query(`
      CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard');
    `);
    await queryRunner.query(`
      CREATE TYPE reward_assignment AS ENUM ('per_tap', 'on_challenge_complete');
    `);
    await queryRunner.query(`
      CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'expired', 'abandoned');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'dhikr_challenges',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'title_key',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description_key',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'challenge_type',
          },
          {
            name: 'difficulty',
            type: 'challenge_difficulty',
            default: "'medium'",
          },
          {
            name: 'target_count',
            type: 'integer',
          },
          {
            name: 'duration_days',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'arabic_text',
            type: 'text',
          },
          {
            name: 'transliteration',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'audio_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'reward_points',
            type: 'integer',
            default: 0,
          },
          {
            name: 'reward_assignment',
            type: 'reward_assignment',
            default: "'per_tap'",
          },
          {
            name: 'badge_icon_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_recurring',
            type: 'boolean',
            default: false,
          },
          {
            name: 'recurrence_pattern',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX idx_dhikr_challenges_type ON dhikr_challenges(type, is_active)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_dhikr_challenges_active ON dhikr_challenges(is_active, display_order)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dhikr_challenges');
    await queryRunner.query(`DROP TYPE challenge_type`);
    await queryRunner.query(`DROP TYPE challenge_difficulty`);
    await queryRunner.query(`DROP TYPE reward_assignment`);
    await queryRunner.query(`DROP TYPE challenge_status`);
  }
}