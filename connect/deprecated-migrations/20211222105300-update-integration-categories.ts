import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  for (const fixture of integrationsFixture) {
    await connectDB.collection(integrationsCollection).findOneAndUpdate(
      {
        _id: fixture._id,
      },
      {
        $set: {
          category: fixture.category,
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
