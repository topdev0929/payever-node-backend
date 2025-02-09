import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';

const integrationsCollection: string = 'integrations';
const integrationName: string = 'live-chat';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const fixture: any = integrationsFixture.find((integration: any) => integration.name === integrationName);
  fixture.connect.url = getServiceUrl(fixture.connect.url);

  await connectDB.collection(integrationsCollection).findOneAndUpdate(
    {
      _id: fixture._id,
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

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
