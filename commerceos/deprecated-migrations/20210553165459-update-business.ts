import {
  Db,
  MongoClient,
} from 'mongodb';

const toBeRemoved = [
  'sms',
  'social',
  'help',
  'statistics',
  'contacts',
  'chat',
  'site',
  'message',
  'subscriptions',
  'blog',
  'invoice',
  'ads',
  'blog',
  'coupons',
  'studio',
  'marketing',
];

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  for (const app of toBeRemoved) {
    await connectDB.collection('defaultapps').updateMany(
      { },
      { $pull: { installedApps: { code: app } } },
    );

    await connectDB.collection('businesses').updateMany(
      { },
      { $pull: { installedApps: { code: app } } },
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
