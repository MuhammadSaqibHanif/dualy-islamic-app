import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDhikrChallengeTranslations1704000011000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dhikr_challenge_translations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'challenge_id',
            type: 'uuid',
          },
          {
            name: 'language_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dhikr_text_translation',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'benefits',
            type: 'text',
            isNullable: true,
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
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'dhikr_challenge_translations',
      new TableForeignKey({
        columnNames: ['challenge_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dhikr_challenges',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'dhikr_challenge_translations',
      new TableForeignKey({
        columnNames: ['language_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'languages',
        onDelete: 'CASCADE',
      }),
    );

    // Create unique index on challenge_id + language_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_challenge_translations_unique ON dhikr_challenge_translations(challenge_id, language_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_challenge_translations_lang ON dhikr_challenge_translations(language_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dhikr_challenge_translations');
  }
}