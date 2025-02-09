import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = await client.db();
  await connectDB.collection(integrationsCollection).deleteOne({ name: 'google_wallet' });

  const fixture: any = integrationsFixture.find((integration: any) => integration.name === 'google_pay');
  const existing: Array<{ }> = await db._find(integrationsCollection, { _id: fixture._id });
  if (!existing.length) {
    fixture.connect.url = getServiceUrl(fixture.connect.url);
    await db.insert('integrations', fixture);
  }

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
