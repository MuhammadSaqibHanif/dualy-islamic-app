import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCollaborativeChallengeStats1704000016000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'collaborative_challenge_stats',
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
            isUnique: true,
          },
          {
            name: 'total_participants',
            type: 'integer',
            default: 0,
          },
          {
            name: 'total_count',
            type: 'bigint',
            default: 0,
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
      'collaborative_challenge_stats',
      new TableForeignKey({
        columnNames: ['challenge_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dhikr_challenges',
        onDelete: 'CASCADE',
      }),
    );

    // Create index
    await queryRunner.query(
      `CREATE INDEX idx_collaborative_stats_challenge ON collaborative_challenge_stats(challenge_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('collaborative_challenge_stats');
  }
}