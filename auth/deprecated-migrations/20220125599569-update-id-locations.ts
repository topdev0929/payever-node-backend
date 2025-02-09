import {
  Db,
  MongoClient,
} from 'mongodb';
import { v4 as uuid } from 'uuid';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const locations: any[] = await connectDB.collection('locations').find({ }).toArray();

  await connectDB.collection('locations').deleteMany({ });

  if (locations && locations.length > 0)
  {
    await connectDB.collection('locations').insertMany(
      locations.map((location: any) => (
      {
        ...location,
        _id: uuid(),
      })),
    );
  }

  await client.close();

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
