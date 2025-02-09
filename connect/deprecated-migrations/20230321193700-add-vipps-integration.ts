import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();
  
  const fixtures: any[] = integrationsFixture.filter((integration: any) => {
    return ['vipps'].includes(integration.name);
  });
  
  for (const fixture of fixtures) {
    fixture.connect.url = getServiceUrl(fixture.connect.url);
    if (fixture?.extension?.url) {
      fixture.extension.url = getServiceUrl(fixture.extension.url);
    }
    
    const integrations: any = await connectDB.collection(integrationsCollection).findOne(
      { name: fixture.name},
    );
    
    const integrationId: string = integrations?.length ? integrations[0]._id : fixture._id;
    
    await connectDB.collection(integrationsCollection).findOneAndUpdate(
      {
        _id: integrationId,
      },
      {
        $set: fixture,
      },
      {
        upsert: true,
      },
    );
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
