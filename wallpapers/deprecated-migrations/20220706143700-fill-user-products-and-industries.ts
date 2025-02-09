import { userProducts } from '../fixtures/user-products.fixture';
import { userProductsIndustries } from '../fixtures/user-products-industries.fixture';
import { MongoClient, Db } from 'mongodb';

const userProductsCollection: string = 'user-products';
const userProductsIndustriesCollection: string = 'user-products-industries';

async function up(db: any): Promise<void> {
  const client: MongoClient = new MongoClient(
    db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true },
  );
  await client.connect();
  const connectDB: Db = await client.db();

  for (const productIndustry of userProductsIndustries) {
    await connectDB.collection(userProductsIndustriesCollection).findOneAndUpdate(
      { _id: productIndustry._id},
      { $set: productIndustry},
      { upsert: true},
    );
  }

  for (const product of userProducts) {
    await connectDB.collection(userProductsCollection).findOneAndUpdate(
      { _id: product._id},
      { $set: product},
      { upsert: true},
    );
  }

  await client.close();

  return null;
}

async function down(db: any): Promise<void> {
  await db._run('dropCollection', userProductsCollection);
  await db._run('dropCollection', userProductsIndustriesCollection);
}

module.exports.up = up;
module.exports.down = down;
