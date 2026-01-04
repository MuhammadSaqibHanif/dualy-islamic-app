import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserStats1704000012000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_stats',
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
            isUnique: true,
          },
          {
            name: 'total_duas_read',
            type: 'integer',
            default: 0,
          },
          {
            name: 'total_dhikr_count',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'total_challenges_completed',
            type: 'integer',
            default: 0,
          },
          {
            name: 'total_challenges_joined',
            type: 'integer',
            default: 0,
          },
          {
            name: 'current_streak_days',
            type: 'integer',
            default: 0,
          },
          {
            name: 'longest_streak_days',
            type: 'integer',
            default: 0,
          },
          {
            name: 'last_activity_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'total_points',
            type: 'integer',
            default: 0,
          },
          {
            name: 'level',
            type: 'integer',
            default: 1,
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
      'user_stats',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create index
    await queryRunner.query(
      `CREATE INDEX idx_user_stats_user ON user_stats(user_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_stats');
  }
}