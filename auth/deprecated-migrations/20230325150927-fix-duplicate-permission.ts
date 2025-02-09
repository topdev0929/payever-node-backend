import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const employees: any[] = await connectDB.collection('employees').find({ }).toArray();

  for (const employee of employees) {
    const permissions: any = { };

    if (!employee.permissions) {
      continue;
    }

    for (const permission of employee.permissions) {
      permissions[permission.businessId] = permission;
    }

    await connectDB.collection('employees').findOneAndUpdate(
      { _id: employee._id },
      { $set: {
        permissions: Object.values(permissions),
      }},
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
