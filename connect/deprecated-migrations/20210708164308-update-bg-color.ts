import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();
  
  for (const integration of integrationsFixture) {
    await connectDB.collection(integrationsCollection).findOneAndUpdate(
      {
        name: integration.name,
      },
      {
        $set: {
          displayOptions: integration.displayOptions,
        },
      },
    );    
  }

  await client.close();
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
