import { MongoClient} from 'mongodb';

const businessCollection = 'businesses';

async function up(db) {

    const client = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB = await client.db();
    const businessMap: any[] = [];
    const oldIds: any[] = [];
    await new Promise((rootResolve: (value?: unknown | Promise<unknown>) => void | Promise<void>, rootReject:(reason?: unknown | Promise<unknown>) => void| Promise<void>)  => {
      connectDB.collection(businessCollection).find()
      .stream()
      .on('data', (doc: any) => {
        oldIds.push(doc._id);
        businessMap.push({
          _id: doc.businessId,
          integrationSubscriptions: doc.integrationSubscriptions,
          shippingAppInstalled: doc.shippingAppInstalled,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          currency: doc.currency,
          __v: doc.__v,
        });
      })
      .on('error', (err) => {
        // tslint:disable-next-line: no-console
        console.error(err);
      })
      .on('end', async () => {
        await connectDB.collection(businessCollection).deleteMany( { _id: { $in: oldIds }});
        await connectDB.collection(businessCollection).bulkWrite(businessMap.map(v => ({ insertOne: { document: v } })));
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
