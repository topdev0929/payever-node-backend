import {
  Db,
  MongoClient,
} from 'mongodb';
import { v4 as uuid } from 'uuid';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB: Db = client.db();

  const oauthClients: any[] = await connectDB.collection('oauthclients').find({
    $nor: [
      { businesses: { $exists: false }},
      { businesses: { $size: 0} },
      { businesses: { $size: 1} },
    ],
  }).toArray();

  for (const oauthClient of oauthClients) {
    const orgId: string = uuid();
    await connectDB.collection('organizations').insert({
      _id: orgId,
      businesses: oauthClient.businesses,
      name: oauthClient.name,
    });
    await connectDB.collection('oauthclients').updateOne(
      {
        _id: oauthClient._id,
      },
      {
        $set: {
          businesses: [],
          organization: orgId,
        },
      },
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
