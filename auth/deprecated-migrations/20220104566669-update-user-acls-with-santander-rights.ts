import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({
    userId: { $exists: true },
  }).toArray();

  const users: any[] = await connectDB.collection('users').find({
    _id: { $nin: employees.map((employee: any) => employee._id) },
  }).toArray();

  for (const user of users) {
    const roles: any = user.roles.map((role: any) => {
      return {
        name: role.name,
        permissions: role.permissions.map((permission: any) => {
          const acls: any = permission.acls.filter((acl: any) => {
            return ![
              'checkout', 'connect', 'transactions', 'pos', 'settings', 'commerceos',
            ].includes(acl.microservice) && acl.microservice;
          });

          ['checkout', 'connect', 'transactions', 'pos', 'settings', 'commerceos'].forEach(
            (acl: any) => {
              acls.push({
                create: true,
                delete: true,
                microservice: acl,
                read: true,
                update: true,
              });
            },
          );

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
