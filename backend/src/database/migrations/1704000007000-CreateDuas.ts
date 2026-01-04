import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDuas1704000007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'duas',
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
            isNullable: true,
          },
          {
            name: 'reference',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'reference_type',
            type: 'varchar',
            length: '50',
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
            name: 'audio_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'audio_duration_seconds',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'recitation_count',
            type: 'integer',
            default: 1,
          },
          {
            name: 'benefits_key',
            type: 'varchar',
            length: '100',
            isNullable: true,
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
            name: 'is_featured',
            type: 'boolean',
            default: false,
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

    await queryRunner.createForeignKey(
      'duas',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dua_categories',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX idx_duas_category ON duas(category_id, display_order) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_duas_reference_type ON duas(reference_type) WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_duas_featured ON duas(is_featured) WHERE is_featured = TRUE AND deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('duas');
  }
}