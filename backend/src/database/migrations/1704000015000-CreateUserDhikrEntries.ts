import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserDhikrEntries1704000015000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_dhikr_entries',
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
            isNullable: true,
          },
          {
            name: 'count',
            type: 'integer',
          },
          {
            name: 'device_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'recorded_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'synced_at',
            type: 'timestamp',
            isNullable: true,
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
      'user_dhikr_entries',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_dhikr_entries',
      new TableForeignKey({
        columnNames: ['challenge_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'dhikr_challenges',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX idx_dhikr_entries_user ON user_dhikr_entries(user_id, recorded_at)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_dhikr_entries_challenge ON user_dhikr_entries(challenge_id, recorded_at)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_dhikr_entries_sync ON user_dhikr_entries(synced_at) WHERE synced_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_dhikr_entries');
  }
}