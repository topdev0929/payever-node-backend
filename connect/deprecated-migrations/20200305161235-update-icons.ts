import { MongoClient } from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {_id: '630160ac-c6e7-44d2-8bfb-aab91f430fcc'},
    {
      $set: {
        'installationOptions.optionIcon': '#icon-woo-commerce-bw',
      },
    },
    {upsert: true},
  );

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {_id: '3b64af61-09c2-427c-9563-1114926ba1d5'},
    {
      $set: {
        'installationOptions.optionIcon': '#icon-xt-commerce-bw',
      },
    },
    {upsert: true},
  );

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
