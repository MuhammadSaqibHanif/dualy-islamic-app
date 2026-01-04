import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserDailyActivity1704000013000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_daily_activity',
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
            name: 'activity_date',
            type: 'date',
          },
          {
            name: 'duas_read',
            type: 'integer',
            default: 0,
          },
          {
            name: 'dhikr_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'challenges_completed',
            type: 'integer',
            default: 0,
          },
          {
            name: 'session_duration_minutes',
            type: 'integer',
            default: 0,
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
      'user_daily_activity',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create unique index on user_id + activity_date
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_daily_activity_unique ON user_daily_activity(user_id, activity_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_daily_activity_user_date ON user_daily_activity(user_id, activity_date DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_daily_activity');
  }
}