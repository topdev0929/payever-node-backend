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
      { positions: { $exists: false }},
      { positions: { $size: 0} },
      { permissions: { $exists: false }},
      { permissions: { $size: 0} },
    ],
    roles: { $exists: true },
  }).toArray();
  
  await connectDB.collection('employees').updateMany(
    { _id: { $in: employees.map((employee: any) => employee._id) } },
    {
      $unset: {
        acls: '',
        roles: '',
      },
    },
  );

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
