import { InsertWriteOpResult, MongoClient } from 'mongodb';
import { v4 as uuidV4 } from 'uuid';
import { defaultRulesFixture } from '../fixtures/defaultrules.fixture';

const integrationSubscriptionCollection = 'integrationsubscriptions';
const integrationRulesCollection = 'integrationrules';
const customIntegrationId = '006a70b6-a178-11e9-ae52-332822bea546';

async function up(db) {
    const client: MongoClient = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB = await client.db();
    const subscriptions: any[] = [];
    await new Promise((rootResolve: (value?: unknown | Promise<unknown>) => void | Promise<void>, rootReject:(reason?: unknown | Promise<unknown>) => void| Promise<void>)  => {
      connectDB.collection(integrationSubscriptionCollection).find({integration: customIntegrationId})
      .stream()
      .on('data', (doc: any) => {
        subscriptions.push(doc._id);
      })
      .on('error', (err) => {
        // tslint:disable-next-line: no-console
        console.error(err);
      })
      .on('end', async () => {

        const promises = subscriptions.map(subscription => new Promise(async (resolve: (value?: unknown | Promise<unknown>) => void | Promise<void>, reject: (reason?: unknown | Promise<unknown>) => void| Promise<void>) => {
          const fixtures = defaultRulesFixture.map(fixture => ({_id:uuidV4(), ...fixture}));
          const rules: InsertWriteOpResult<any> =
            await connectDB.collection(integrationRulesCollection).insertMany(fixtures);
          await connectDB.collection(integrationSubscriptionCollection)
            .updateOne({ _id: subscription },{ $set: { rules: fixtures.map( f =>f._id) }});
          resolve();
        }));
        await Promise.all(promises);


        rootResolve();
      });
    });
    await client.close();

    return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
