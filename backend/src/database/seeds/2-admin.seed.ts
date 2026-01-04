import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminRole } from '@modules/admin/entities/admin-user.entity';

export async function seedAdmin(dataSource: DataSource) {
  const adminRepository = dataSource.getRepository(AdminUser);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dualy.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await adminRepository.findOne({ where: { email: adminEmail } });
  
  if (!existing) {
    const password_hash = await bcrypt.hash(adminPassword, 10);

    const admin = adminRepository.create({
      email: adminEmail,
      password_hash,
      full_name: 'System Administrator',
      role: AdminRole.SUPER_ADMIN,
      can_manage_users: true,
      can_manage_content: true,
      can_manage_translations: true,
      can_view_analytics: true,
      is_active: true,
    });

    await adminRepository.save(admin);
    console.log(`✅ Seeded admin user: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  }
}