import { RolesEnum } from '@pe/nest-kit';

export async function up(db: any): Promise<void> {
  interface RoleWithType { type: RolesEnum; }

  await db._run('updateMany', 'users', { query: { }, update: { $unset: { oldRoles: ''}}});
  await db._run('updateMany', 'users', { query: { roles: { $not: { $type: 4}}}, update: { $set: { roles: []}}});
  const users: any[] = await db._find('users', { });
  for (const user of users) {
    for (const role of user.roles) {
      if (!role) {
        continue;
      }

      role.name = role.name || role.type;
      role.type = role.name;
    }
    await db._run('update', 'users', { query: { _id: user._id}, update: { $set: { roles: user.roles}}});
  }
}

export async function down(): Promise<void> { }
