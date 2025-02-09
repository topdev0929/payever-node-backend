import { MongoClient} from 'mongodb';
import { v4 as uuid } from 'uuid';
import { shippingboxesFixture } from '../fixtures/shippingboxes.fixture';
const businessCollection = 'businesses';
const shippingSettingsCollection = 'shippingsettings';

async function up(db) {
  try {
    await db.createCollection(shippingSettingsCollection);
  } catch (e) { }
    const client = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB = await client.db();
    const businessIds: any[] = [];
    await new Promise((rootResolve: (value?: unknown | Promise<unknown>) => void | Promise<void>, rootReject:(reason?: unknown | Promise<unknown>) => void| Promise<void>)  => {
      connectDB.collection(businessCollection).find()
      .stream()
      .on('data', (doc: any) => {

        businessIds.push(doc._id);
      })
      .on('error', (err) => {
        // tslint:disable-next-line: no-console
        console.error(err);
      })
      .on('end', async () => {
        await connectDB.collection(shippingSettingsCollection).bulkWrite(businessIds.map( businessId => ({ insertOne: { document: {_id: uuid(), businessId, boxes: shippingboxesFixture.map(box => box._id), origins: [], zones: []} } })));
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
