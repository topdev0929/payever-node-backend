// tslint:disable: await-promise
import { Db, MongoClient } from 'mongodb';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  await connectDB.collection('folders').update(
    {
      createdBy: 'merchant',
    },
    {
      $set: {
        scope: 'business',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  await connectDB.collection('folders').update(
    {
      createdBy: 'admin',
    },
    {
      $set: {
        scope: 'default',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  await client.close();
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
