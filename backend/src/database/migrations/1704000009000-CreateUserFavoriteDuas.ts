import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserFavoriteDuas1704000009000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_favorite_duas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'dua_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_favorite_duas',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_favorite_duas',
      new TableForeignKey({
        columnNames: ['dua_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'duas',
        onDelete: 'CASCADE',
      }),
    );

    // Create unique index on user_id + dua_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_user_favorites_unique ON user_favorite_duas(user_id, dua_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_user_favorites_user ON user_favorite_duas(user_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_favorite_duas');
  }
}