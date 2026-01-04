import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDuaCategories1704000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dua_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name_key',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'icon_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'color_hex',
            type: 'varchar',
            length: '7',
            default: "'#000000'",
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
      `CREATE INDEX idx_dua_categories_active ON dua_categories(is_active, display_order) WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dua_categories');
  }
}