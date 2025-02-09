import {
  MongoClient,
} from 'mongodb';
import * as dotenv from 'dotenv';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

async function up(db) {
  const fixture: any = integrationsFixture.find((integration: any) => integration.name === 'qr');
  fixture.extension.url = getServiceUrl(fixture.extension.url);

  const client = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();
  connectDB.collection(integrationsCollection).findOneAndUpdate(
    { _id: fixture._id },
    {$set: fixture},
    {upsert:true}
  );
  
  await client.close();

  return null;
}

function down() {
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
