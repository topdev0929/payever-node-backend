import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employeesWithUser: any[] = await connectDB.collection('employees').find(
    { userId: { $ne: null } },
  ).toArray();
  const users: any[] = await connectDB.collection('users').find({
    _id: { $in: employeesWithUser.map((a: any) => a.userId )},
  }).toArray();

  for (const user of users) {
    const roles: any = user.roles.map((role: any) => {
      return {
        name: role.name,
        permissions: role.permissions.map((permission: any) => {
          const acls: any = permission.acls.filter((acl: any) => {
            return acl.microservice !== 'commerceos';
          });

          return {
            acls: [
              ...acls,
              {
                create : false,
                delete : false,
                microservice : 'commerceos',
                read : true,
                update : false,
              },
            ],
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
