import {
  Db,
  MongoClient,
} from 'mongodb';
import { apps } from '../fixtures/dashboard-apps.fixture';

const toBeAdded = [
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

  for (const app of apps) {
    if (toBeAdded.includes(app.code)) {
      await connectDB.collection('dashboardapps').deleteOne(
        {
          code: app.code,
        },
      );
      await connectDB.collection('dashboardapps').insertOne(app);
    }
  }

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
