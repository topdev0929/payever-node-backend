import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  for (const fixture of integrationsFixture) {
    if (fixture.connect && fixture.connect.url) {
      fixture.connect.url = getServiceUrl(fixture.connect.url);
    }

    await connectDB.collection(integrationsCollection).findOneAndUpdate(
      {
        _id: fixture._id,
      },
      {
        $set: fixture,
      },
    );
  }

  await client.close();
}

function down(): void { }

function getServiceUrl(identifier: string): string {
  dotenv.config();
  const regex: RegExp = /\${(\w+)}/g;
  let url = identifier;
  let matches = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url);
  }

  return url;
}

module.exports.up = up;
module.exports.down = down;
