import { Db, MongoClient } from 'mongodb';

const previousCollectionName: string = 'partners';
const onboardingsCollection: string = 'onboardings';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  await connectDB.renameCollection(previousCollectionName, onboardingsCollection);

  await connectDB.collection(onboardingsCollection).update(
    {
    },
    {
      $set: {
        type: 'partner',
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
