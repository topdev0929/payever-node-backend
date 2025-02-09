import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';
const integrationName: string = 'qr';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const extension: any = {
    formAction: {
      actionEndpoint: '/business/{businessId}/integration/qr/action/{action}',
      endpoint: '/business/{businessId}/integration/qr/action/generate',
      initEndpoint: '/business/{businessId}/integration/qr/form',
      method: 'POST',
    },
    url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api',
  };

  const fixture: any = integrationsFixture.find((integration: any) => integration.name === integrationName);
  fixture.extension = extension;

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      name: integrationName,
    },
    {
      $set: fixture,
    },
    {
      upsert: true,
    },
  );

  await client.close();
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
