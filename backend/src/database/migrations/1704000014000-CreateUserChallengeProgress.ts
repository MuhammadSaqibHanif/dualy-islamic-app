import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserChallengeProgress1704000014000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_challenge_progress',
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
            name: 'challenge_id',
            type: 'uuid',
          },
          {
            name: 'current_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'target_count',
            type: 'integer',
          },
          {
            name: 'status',
            type: 'challenge_status',
            default: "'active'",
          },
          {
            name: 'started_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'last_updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_challenge_progress',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_challenge_progress',
      new TableForeignKey({
        columnNames: ['challenge_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dhikr_challenges',
        onDelete: 'CASCADE',
      }),
    );

    // Create unique index on user_id + challenge_id
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_user_challenge_progress_unique ON user_challenge_progress(user_id, challenge_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_user_challenge_progress_user ON user_challenge_progress(user_id, status)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_user_challenge_progress_challenge ON user_challenge_progress(challenge_id, status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_challenge_progress');
  }
}