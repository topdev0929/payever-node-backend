import { v4 as uuid } from 'uuid';

import { Connection, createConnection } from 'mongoose';

async function moveCollections(connection: Connection, collectionName: string): Promise<void> {
  await connection.db.collection('users').rename('old_users');
  await connection.db.collection(collectionName).rename('users');
  await connection.db.dropCollection('old_users');
}

async function getNewPermission(permission: any, connection: Connection): Promise<any> {
  const newPermission: any = { businessId: permission.businessId, acls: [] };

  if (Array.isArray(permission.acls)) {
    for (const aclId of permission.acls) {
      const acls: any[] = await connection.db
        .collection('acls')
        .find({ _id: aclId })
        .toArray();
      for (const acl of acls) {
        delete acl._id;
        newPermission.acls.push(acl);
      }
    }
  }

  return newPermission;
}

async function getNewRole(connection: Connection, role: any, roleType: any): Promise<any> {
  const newRole: any = { type: roleType.name, permissions: [] };

  if (role.permissions) {
    for (const permissionId of role.permissions) {
      const permissions: any[] = await connection.db
        .collection('permissions')
        .find({ _id: permissionId })
        .toArray();
      for (const permission of permissions) {
        const newPermission: any = await getNewPermission(permission, connection);
        newRole.permissions.push(newPermission);
      }
    }
  }

  return newRole;
}

async function updateUser(user: any, connection: Connection, collectionName: string): Promise<void> {
  const $set: { roles: any[]; oldRoles: any[] } = { oldRoles: [], roles: [] };

  if (Array.isArray(user.roles)) {
    for (const roleId of user.roles) {
      const roles: any[] = await connection.db
        .collection('roles')
        .find({ _id: roleId })
        .toArray();
      for (const role of roles) {
        const roleTypes: any[] = await connection.db
          .collection('role_types')
          .find({ _id: role.type })
          .toArray();
        for (const roleType of roleTypes) {
          if (roleType.name !== 'user') {
            $set.roles.push(await getNewRole(connection, role, roleType));
          }
        }
      }
      $set.oldRoles = user.roles;

      await connection.db.collection(collectionName).updateOne({ _id: user._id }, { $set });
    }
  }
}

async function parseUsers(connection: Connection, collectionName: string): Promise<void> {
  const users: any[] = await connection.db
    .collection(collectionName)
    .find({ roles: { $type: 2 } })
    .toArray();

  for (const user of users) {
    await updateUser(user, connection, collectionName);
  }
}

export async function up(db: any): Promise<void> {
  const collectionName: string = `new-users-${uuid()}`;
  const connection: Connection = await createConnection(db.connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });
  try {
    await connection.db
      .collection('users')
      .aggregate([{ $match: { } }, { $out: collectionName }])
      .toArray();
    await parseUsers(connection, collectionName);
    await moveCollections(connection, collectionName);
  } finally {
    await connection.close();
  }
}

export async function down(): Promise<void> { }
