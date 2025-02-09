import { Db, MongoClient } from 'mongodb';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = await client.db();

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      name: 'facebook',
    },
    {
      $set: {
        'displayOptions.icon': '#icon-channel-facebook',
        'installationOptions.optionIcon': '#icon-channel-facebook',
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
