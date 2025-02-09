import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({
    permissions: {
      $elemMatch: {
        $or: [
          { acls: { $exists: false }},
          { acls: { $size: 0} },
          { acls: { $size: 1} },
        ],
      },
    },
  }).toArray();

  for (const employee of employees) {
    const permissions: any[] = employee.permissions.map((permission: any) => {
      if (permission.acls && permission.acls.length > 1) {
        return permission;
      }
      
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
    });
  
    await connectDB.collection('employees').findOneAndUpdate(
      { _id: employee._id },
      {
        $set: {
          permissions,
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
