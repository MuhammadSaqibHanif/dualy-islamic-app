import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedAtToUserStats1704000018000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column already exists
    const table = await queryRunner.getTable('user_stats');
    const hasDeletedAt = table?.columns.find(col => col.name === 'deleted_at');
    
    if (!hasDeletedAt) {
      await queryRunner.addColumn(
        'user_stats',
        new TableColumn({
          name: 'deleted_at',
          type: 'timestamp',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_stats', 'deleted_at');
  }
}