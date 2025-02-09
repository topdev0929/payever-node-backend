import {
  Db,
  MongoClient,
} from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const oldEmployees: any[] = await connectDB.collection('users').find({ $nor: [
    { positions: { $exists: false}},
    { positions: { $size: 0}},
  ]}).toArray();

  for (const employee of oldEmployees) {
    if (employee.roles[0]?.permissions[0]) {
      employee.acls = employee.roles[0].permissions[0].acls;
    }
    employee.userId = employee._id;
    await connectDB.collection('employees').insertOne(employee);

    await connectDB.collection('users').findOneAndUpdate(
      { _id: employee._id }, 
      {
        '$unset': { positions: 1 },
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
