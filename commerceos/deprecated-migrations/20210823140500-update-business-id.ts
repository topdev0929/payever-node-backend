import { Db, MongoClient } from 'mongodb';

const stepsCollection: string = 'businesssteps';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  try {
    await connectDB.collection(stepsCollection).dropIndex('business_1_section_1_step_1');
    await connectDB.collection(stepsCollection).dropIndex('business_1_section_1');
    await connectDB.collection(stepsCollection).dropIndex('business_1');
  } catch (e) { }

  await connectDB.collection(stepsCollection).update(
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
