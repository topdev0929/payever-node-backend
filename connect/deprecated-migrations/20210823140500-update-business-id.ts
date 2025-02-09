import { Db, MongoClient } from 'mongodb';

const foldersCollection: string = 'folders';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  try {
    await connectDB.collection(foldersCollection).dropIndex('_id_1_business_1');
    await connectDB.collection(foldersCollection).dropIndex('ancestors_1_business_1');
    await connectDB.collection(foldersCollection).dropIndex('business_1_name_1');
    await connectDB.collection(foldersCollection).dropIndex('business_1_parent_1');
    await connectDB.collection(foldersCollection).dropIndex('name_1_parent_1_business_1');
  } catch (e) { }

  await connectDB.collection(foldersCollection).update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
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
