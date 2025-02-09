import { Db, MongoClient } from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  await connectDB.collection('users').updateMany(
    { roles: { $not: { $elemMatch: { name: 'user'}}}},
    {
      $push: {
        roles: {
          name: 'user',
          permissions: [],
        },
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
