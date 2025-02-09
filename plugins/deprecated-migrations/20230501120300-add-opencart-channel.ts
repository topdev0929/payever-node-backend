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

  const channel = channelsFixture.find((item: any) => item.type === 'opencart');

  if (!channel) {
    return;
  }

  await connectDB.collection(channelsCollection).findOneAndUpdate(
    {
      _id: channel._id,
    },
    {
      $set: channel,
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

module.exports.up = up;
module.exports.down = down;
