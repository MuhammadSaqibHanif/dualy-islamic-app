import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdminUsers1704000017000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM type
    await queryRunner.query(`
      CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'translator', 'content_moderator');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'admin_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'admin_role',
            default: "'admin'",
          },
          {
            name: 'can_manage_users',
            type: 'boolean',
            default: false,
          },
          {
            name: 'can_manage_content',
            type: 'boolean',
            default: true,
          },
          {
            name: 'can_manage_translations',
            type: 'boolean',
            default: true,
          },
          {
            name: 'can_view_analytics',
            type: 'boolean',
            default: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
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

    // Create index
    await queryRunner.query(
      `CREATE INDEX idx_admin_users_email ON admin_users(email) WHERE is_active = TRUE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin_users');
    await queryRunner.query(`DROP TYPE admin_role`);
  }
}