import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const users: any[] = await connectDB.collection('users').find({
    roles: {
      $elemMatch: {
        name: 'merchant',
        permissions: {
          $elemMatch: {
            acls: { 
              $elemMatch: {
                microservice : { $exists: false },
              },
            },
          },
        },
      },
    },
  }).toArray();

  for (const user of users) {
    const roles: any = user.roles.map((role: any) => {
      return {
        name: role.name,
        permissions: role.permissions.map((permission: any) => {
          const acls: any = permission.acls.filter((acl: any) => {
            return !!acl.microservice;
          });

          return {
            acls,
            businessId: permission.businessId,
          };
        }),
      };
    });

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
