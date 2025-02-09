import { integrationsFixture } from '../fixtures/integrations.fixture';
import {
  MongoClient,
} from 'mongodb';

const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  const integration =  await connectDB.collection(integrationsCollection).findOne({ name: 'google_shopping' });
  if (integration) {
    await connectDB.collection(integrationsCollection).deleteMany({ _id: integration._id })
  }
  await connectDB.collection(integrationsCollection).insertOne({
    _id: '68b8c75c-fd3f-4450-b44b-b1d0057110d6',
    name: 'google_shopping',
    category: 'products',
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  });
  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
