import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDuaTranslations1704000008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dua_translations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'dua_id',
            type: 'uuid',
          },
          {
            name: 'language_id',
            type: 'uuid',
          },
          {
            name: 'translation',
            type: 'text',
          },
          {
            name: 'benefits',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'translator_name',
            type: 'varchar',
            length: '255',
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
      'dua_translations',
      new TableForeignKey({
        columnNames: ['dua_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'duas',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'dua_translations',
      new TableForeignKey({
        columnNames: ['language_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'languages',
        onDelete: 'CASCADE',
      }),
    );

    // Create unique index on dua_id + language_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_dua_translations_unique ON dua_translations(dua_id, language_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_dua_translations_language ON dua_translations(language_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_dua_translations_dua ON dua_translations(dua_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dua_translations');
  }
}