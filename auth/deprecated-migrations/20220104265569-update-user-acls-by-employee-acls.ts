import {
  Db,
  MongoClient,
} from 'mongodb';

function mergeDefaultAcls(acls: any[]): any[] {
  const defaultAclIndex: number = acls.findIndex((acl: any) => acl.microservice === 'commerceos');
  if (defaultAclIndex > -1) {
    acls[defaultAclIndex].read = true;
  } else {
    acls.push({
      microservice : 'commerceos',
      read : true,
    });
  }

  return acls;
}

function mergePermissions(userPermissions: any[], employeePermissions: any[]): any[] {
  employeePermissions.forEach((element: any) => {
    const foundBusinessIndex: any = userPermissions.findIndex(
      (x: any) => x.businessId === element.businessId,
    );
    if (foundBusinessIndex > -1) {
      userPermissions[foundBusinessIndex].acls = mergeDefaultAcls(element.acls);
    } else {
      userPermissions.push({
        acls: mergeDefaultAcls(element.acls),
        businessId: element.businessId,
      });
    }
  });

  return userPermissions;
}

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({
    $nor: [
      { positions: { $exists: false }},
      { positions: { $size: 0} },
      { permissions: { $exists: false }},
      { permissions: { $size: 0} },
    ],
    positions: { 
      $elemMatch: {
        status : 2,
      },
    },
    userId: { $exists: true },
  }).toArray();

  for (const employee of employees) {
    const user: any = await connectDB.collection('users').findOne(
      { _id: employee.userId },
    );

    if (!user) {
      continue;
    }

    const roles: any = user.roles.map((role: any) => {
      if (role.name !== 'merchant') {
        return role;
      }

      role.permissions = mergePermissions(role.permissions, employee.permissions);

      return role;
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
