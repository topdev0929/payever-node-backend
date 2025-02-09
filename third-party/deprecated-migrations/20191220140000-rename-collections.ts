import { MongoClient } from 'mongodb';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  await connectDB.collection('thirdparties').rename('integrations');
  await connectDB.collection('thirdpartysubscriptions').rename('integrationsubscriptions');

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
