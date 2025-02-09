import {
  MongoClient,
} from 'mongodb';

const integrationSubsCollection = 'integrationsubscriptions';
const integrationsCollection = 'integrations';

async function up(db) {
  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  const twilioIntegration =  await connectDB.collection(integrationsCollection).findOne({ name: 'twilio' });
  if (twilioIntegration) {
    await connectDB.collection(integrationSubsCollection).deleteMany({ integration: twilioIntegration._id })
  }
  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
