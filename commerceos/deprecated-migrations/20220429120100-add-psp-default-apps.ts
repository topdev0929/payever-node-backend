import { industryApps, paymentApps } from '../fixtures/onboardings.fixture';
import { MongoClient, Db } from 'mongodb';

const defaultAppsCollection: string = 'defaultapps';

async function up(db: any): Promise<any> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();
  console.log('industryApps', industryApps);
  console.log('paymentApps', paymentApps);

  const installedApps: any[] = [
    ...industryApps,
    ...paymentApps,
  ];

  await connectDB.collection(defaultAppsCollection).findOneAndUpdate(
    {
      _id: 'psp',
    },
    {
      $set: {
        installedApps,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      upsert: true,
    },
  );

  await client.close();
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
