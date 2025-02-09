import {
  MongoClient,
} from 'mongodb';

const integrationSubsCollection = 'integrationsubscriptions';
const integrationsCollection = 'integrations';
const debitoorIntegrationName = 'debitoor';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  const debitoorIntegration =  await connectDB.collection(integrationsCollection)
    .findOne({ name: debitoorIntegrationName });

  if (debitoorIntegration) {
    await connectDB.collection(integrationSubsCollection).deleteMany({ integration: debitoorIntegration._id })
  }

  await connectDB.collection(integrationsCollection).deleteOne({ name: debitoorIntegrationName });

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
