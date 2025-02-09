import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = client.db();

  let fixture: any = integrationsFixture.find((integration: any) => integration.name === 'zinia_bnpl');
  fixture.connect.url = getServiceUrl(fixture.connect.url);
  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      $or: [
        { name: 'openbank'},
        { name: 'zinia_bnpl'},
      ],
    },
    {
      $set: fixture,
    },
    {
      upsert: true,
    },
  );

  // openbank_pos -> zinia_pos
  fixture = integrationsFixture.find((integration: any) => integration.name === 'zinia_pos');
  fixture.connect.url = getServiceUrl(fixture.connect.url);
  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      $or: [
        { name: 'openbank_pos'},
        { name: 'zinia_pos'},
      ],
    },
    {
      $set: fixture,
    },
    {
      upsert: true,
    },
  );

  fixture = integrationsFixture.find((integration: any) => integration.name === 'zinia_installment');
  fixture.connect.url = getServiceUrl(fixture.connect.url);
  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      name: fixture.name,
    },
    {
      $set: fixture,
    },
    {
      upsert: true,
    },
  );

  fixture = integrationsFixture.find((integration: any) => integration.name === 'zinia_slice_three');
  fixture.connect.url = getServiceUrl(fixture.connect.url);
  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      name: fixture.name,
    },
    {
      $set: fixture,
    },
    {
      upsert: true,
    },
  );

  return null;
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
    matches = regex.exec(url);
  }

  return url;
}

module.exports.up = up;
module.exports.down = down;
