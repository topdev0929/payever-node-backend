import {
  Db,
  MongoClient,
} from 'mongodb';
import { v4 as uuid } from 'uuid';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const users: any[] = await connectDB.collection('users').find({    
    $nor: [
      { roles: { $exists: false }},
      { roles: { $size: 0} },
    ],
  }).toArray();
  // tslint:disable-next-line: no-console
  console.log(`${users.length} Users migrated`);
  for (const user of users) {
    const roles: any[] = [];
    for (const role of user.roles) {
      const roleData: any = {
        name: role.name,
        permissions: [],
      };

      if (role.permissions) {
        for (const permission of role.permissions) {
          const _id: any = uuid();
          await connectDB.collection('permissions').insert(
            {
              _id,
              acls: permission.acls,
              businessId: permission.businessId,
              role: role.name,
              userId: user._id,
            },
          );
          roleData.permissions.push(_id);
        }
  
        roles.push(roleData);
      } else {
        roles.push(role);
      }
    }

    await connectDB.collection('users').findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          roles: roles,
        },
      },
    );
  }

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
