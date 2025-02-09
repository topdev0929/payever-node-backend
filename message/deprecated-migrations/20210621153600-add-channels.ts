import {
  Db,
  MongoClient,
} from 'mongodb';
import { channelsFixture } from '../fixtures/channels.fixture';

const channelsCollection: string = 'channels';

async function up(db: any): Promise<void> {

  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();


  for (const fixture of channelsFixture) {
    await connectDB.collection(channelsCollection).findOneAndUpdate(
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
  }
  await client.close();
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
