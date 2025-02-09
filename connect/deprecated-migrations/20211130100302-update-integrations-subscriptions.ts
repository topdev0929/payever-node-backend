import { Db, MongoClient } from 'mongodb';

const integrationsCollection: string = 'integrationsubscriptions';
const businessCollection: string = 'businesses';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const businesses: any = await connectDB.collection(businessCollection).find(
    { subscriptions: { $exists: true, $not: { $size: 0} } },
  ).toArray();
  for (const business of businesses) {
    await connectDB.collection(integrationsCollection).updateMany(
      {
        _id: { $in: business.subscriptions },
      },
      {
        $set: {
          businessId: business._id,
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
