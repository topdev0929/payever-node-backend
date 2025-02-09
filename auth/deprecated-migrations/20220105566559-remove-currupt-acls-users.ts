import {
  Db,
  MongoClient,
} from 'mongodb';

function mergeArrayObjectsWithKey(objArray: any[], key: string, valueKey: string): any[] {
  const arrayMap: any = { };
  objArray.forEach((obj: any) => {
    arrayMap[obj[key]] = arrayMap[obj[key]] ?
      [ ...arrayMap[obj[key]], ...obj[valueKey] ]
      : obj[valueKey];
  });

  return Object.keys(arrayMap).map((element: string) => {
    return {
      [key]: element,
      [valueKey]: arrayMap[element],
    };
  });
}

function removeDuplicateAcls(acls: any[]): any[] {
  const arrayMap: any = { };
  acls.forEach((obj: any) => {
    if (obj.microservice) {
      arrayMap[obj.microservice] = arrayMap[obj.microservice] ?
        {
          create: obj.create || arrayMap[obj.microservice].create,
          delete: obj.delete || arrayMap[obj.microservice].delete,
          microservice: obj.microservice,
          read: obj.read || arrayMap[obj.microservice].read,
          update: obj.update || arrayMap[obj.microservice].update,
        }
        : obj;
    }
  });

  return Object.values(arrayMap);
}

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const users: any[] = await connectDB.collection('users').find({    
    $nor: [
      { roles: { $exists: false }},
      { roles: { $size: 0} },
      { roles: { $size: 1} },
    ],
  }).toArray();
  // tslint:disable-next-line: no-console
  console.log(`${users.length} Currupt Users corrected`);
  for (const user of users) {
    let roles: any[] = mergeArrayObjectsWithKey(user.roles, 'name', 'permissions');

    roles = roles.map((role: any) => {
      let permissions: any[] = mergeArrayObjectsWithKey(role.permissions, 'businessId', 'acls');
      permissions = permissions.map((permission: any) => {
        const acls: any = removeDuplicateAcls(permission.acls);

        return {
          acls,
          businessId: permission.businessId,
        };
      });

      return {
        name: role.name,
        permissions,
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
