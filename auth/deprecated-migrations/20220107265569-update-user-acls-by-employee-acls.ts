import {
  Db,
  MongoClient,
} from 'mongodb';

function mergeAcls(initAcls: any[], newAcls: any[]): any[] {
  const arrayMap: any = { };
  [ ...initAcls, ...newAcls ].forEach((obj: any) => {
    if (obj.microservice) {
      arrayMap[obj.microservice] = arrayMap[obj.microservice] ?
        arrayMap[obj.microservice]
        : obj;
    }
  });

  const acls: any[] = Object.values(arrayMap);

  return acls.length > 1 ? 
    acls
    : ['checkout', 'connect', 'transactions', 'pos', 'settings', 'commerceos'].map(
      (acl: any) => {
        return {
          create: true,
          delete: true,
          microservice: acl,
          read: true,
          update: true,
        };
      },
    );
}

function mergeTwoPermissions(initPermissions: any[], newPermissions: any[]): any[] {
  const finalPermissions: any[] = [];
  initPermissions.forEach((obj: any) => {
    const indexInNew: number = newPermissions.findIndex((permission: any) => permission.businessId === obj.businessId);
    if (indexInNew === -1) {
      finalPermissions.push({
        acls: mergeAcls(obj.acls, []),
        businessId: obj.businessId,
      });
    }
  });

  return [ ...finalPermissions, ...newPermissions ];
}

function mergePermissions(roles: any[], employee: any, groups: any[]): any[] {
  const activeBusiness: string[] = employee.positions
    .filter((position: any) => position.status === 2)
    .map((position: any) => position.businessId);

  const employeeGroupPermissions: any[] = activeBusiness.map((businessId: string) => {
    const employeePermission: any = employee.permissions
      .find((permission: any) => permission.businessId === businessId) || { acls: [] };
    const businessGroup: any = 
      groups.find((group: any) => group.businessId === businessId) || { acls: [] };
    
    return {
      acls: mergeAcls(employeePermission.acls, businessGroup.acls),
      businessId: employeePermission.businessId,
    };
  });

  const merchantRole: any = roles.find((role: any) => role.name === 'merchant');

  if (!merchantRole) {
    roles.push({
      name: 'merchant',
      permissions: [],
    });
  }

  roles = roles.map((role: any) => {
    if (role.name !== 'merchant') {
      return role;
    }

    return {
      name: 'merchant',
      permissions: mergeTwoPermissions(role.permissions, employeeGroupPermissions),
    };
  });

  return roles;
}

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({
    $nor: [
      { positions: { $exists: false }},
      { positions: { $size: 0} },
    ],
    positions: { 
      $elemMatch: {
        status : 2,
      },
    },
    userId: { $exists: true },
  }).toArray();

  for (const employee of employees) {
    const groups: any[] = await connectDB.collection('groups').find(
      { employees: { $in: [employee._id] } },
    ).toArray();
    const user: any = await connectDB.collection('users').findOne(
      { _id: employee.userId },
    );

    if (!user) {
      continue;
    }

    const roles: any = mergePermissions(user.roles, employee, groups);

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
