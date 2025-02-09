import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from "dotenv";

const integrationsCollection: string = 'integrations';
const integrationName: string = 'dhl';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const connect: any = {
    formAction: {
      actionEndpoint: '/business/{businessId}/integration/dhl/action/{action}',
      initEndpoint: '/business/{businessId}/integration/dhl/form',
    },
    url: getServiceUrl('${MICRO_URL_THIRD_PARTY_SHIPPING}/api'),
  };

  const fixture: any = integrationsFixture.find((integration: any) => integration.name === integrationName);
  fixture.connect = connect;

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

function getServiceUrl(identifier: string): string {
  dotenv.config();
  const regex: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url)
  }

  return url;
}

module.exports.up = up;
module.exports.down = down;
