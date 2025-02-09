import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({
    $nor: [
      { acls: { $exists: false }},
      { acls: { $size: 0} },
    ],
    positions: { $elemMatch: { status: 2 } },
    userId: { $exists: true },
  }).toArray();

  for (const employee of employees) {
    const user: any = await connectDB.collection('users').findOne(
      { _id: employee.userId },
    );

    if (!!user) {
      user.roles = mergeAcls(user, employee);

      await connectDB.collection('users').findOneAndUpdate(
        { _id: employee.userId },
        {
          $set: {
            roles: user.roles,
          },
        },
      );
    }
  }

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

const mergeAcls: any = (user: any, employee: any) => {
  let isMerchant: boolean = false;

  if (!user.roles) {
    user.roles = [];
  }

  const roles: any = user.roles.map((role: any) => {
    if (role.name === 'merchant') {
      isMerchant = true;

      return {
        name: 'merchant',
        permissions: role.permissions.map((permission: any) => {
          if (!!employee.positions.find((position: any) => position.businessId === permission.businessId)) {

            return {
              acls: employee.acls,
              businessId: permission.businessId,
            };
          } else {
            return permission;
          }
        }),
      };
    } else {

      return role;
    }
  });

  if (isMerchant) {

    return roles;
  }

  return [
    ...roles,
    {
      name: 'merchant',
      permissions: [
        {
          acls: employee.acls,
          businessId: employee.positions.find((position: any) => position.status === 2).businessId,
        },
      ],
    },
  ];
};

module.exports.up = up;
module.exports.down = down;
