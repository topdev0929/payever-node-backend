// tslint:disable:object-literal-sort-keys
import { Db, MongoClient } from 'mongodb';
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';
const integrationSubscriptionsCollection: string = 'integrationsubscriptions';
const businessesCollection: string = 'businesses';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();
  const integrations: any = await connectDB.collection(integrationsCollection).find().toArray();

  for (const integration of integrations) {
    const index: number = integrationsFixture.findIndex((fixture: any) => {
      return fixture._id === integration._id;
    });

    if (index < 0 ) {
      await connectDB.collection(integrationsCollection).deleteOne({ _id: integration._id});
      await connectDB.collection(integrationSubscriptionsCollection).deleteMany({ integration: integration._id});
    }
  }

  const duplicates: any = await connectDB.collection(integrationSubscriptionsCollection).aggregate(
    [
      {
        $group: {
          _id: {
            businessId: '$businessId',
            integration: '$integration',
          },
          count: { $sum: 1},
        },
      },
      {
        $match: {
          count: { $gt: 1},
        },
      },
      {
        $project: {
          _id: 0,
          businessId: '$_id.businessId',
          integration: '$_id.integration',
        },
      },
    ],
  ).toArray();

  for (const duplicate of duplicates) {
    const subscriptions: any = await connectDB.collection(integrationSubscriptionsCollection).find(
      {
        businessId: duplicate.businessId,
        integration: duplicate.integration,
      },
      {
        sort: { installed: 1, createdAt: -1 },
      },
    ).toArray();

    for (let i: number = 0; i < (subscriptions.length - 1); i++) {
      await connectDB.collection(integrationSubscriptionsCollection).deleteOne({ _id: subscriptions[i]._id});
    }
  }

  const businessesIntegrationsInstalled: any = await connectDB.collection(integrationSubscriptionsCollection).aggregate(
    [
      {
        $match: {
          installed: true,
        },
      },
      {
        $group: {
          _id: {
            businessId: '$businessId',
          },
          integrations: { $addToSet: '$integration'},
        },
      },

      {
        $project: {
          _id: 0,
          businessId: '$_id.businessId',
          integrations: '$integrations',
        },
      },
    ],
  ).toArray();

  for (const businessesIntegrations of businessesIntegrationsInstalled) {
    await connectDB.collection(businessesCollection).findOneAndUpdate(
      { _id: businessesIntegrations.businessId },
      {
        $set: {
          subscriptions: businessesIntegrations.integrations,
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
