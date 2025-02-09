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
        acls: { 
          $elemMatch: {
            microservice : { $exists: false },
          },
        },
      },
    },
  }).toArray();

  for (const employee of employees) {
    const permissions: any = employee.permissions.map((permission: any) => {
      const acls: any = permission.acls.filter((acl: any) => {
        return !!acl.microservice;
      });

      return {
        acls,
        businessId: permission.businessId,
      };
    });

    await connectDB.collection('employees').findOneAndUpdate(
      { _id: employee._id },
      {
        $set: {
          permissions: permissions,
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
