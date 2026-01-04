import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDuaCategoryTranslations1704000006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dua_category_translations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'category_id',
            type: 'uuid',
          },
          {
            name: 'language_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
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
      'dua_category_translations',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dua_categories',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'dua_category_translations',
      new TableForeignKey({
        columnNames: ['language_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'languages',
        onDelete: 'CASCADE',
      }),
    );

    // Create unique index on category_id + language_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_category_translations_unique ON dua_category_translations(category_id, language_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_category_translations_lang ON dua_category_translations(language_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dua_category_translations');
  }
}