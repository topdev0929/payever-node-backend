import { Db, MongoClient } from 'mongodb';

import { products } from '../fixtures/business-products.fixture';

const businessProductsIndustriesCollection: string = 'business-products-industries';
const businessProductsCollection: string = 'business-products';

async function up(db) {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  for (const product of products) {
    const productObject = await connectDB.collection(businessProductsIndustriesCollection).findOneAndUpdate(
      {
        code: product.code,
      },
      {
        $set: {
          code: product.code,
        },
      },
      {
        upsert: true,
      },
    );

    for (const industry of product.industries) {
      await connectDB.collection(businessProductsCollection).findOneAndUpdate(
        {
          code: industry.code,
        },
        {
          $set: industry,
          $setOnInsert: {
            industry: productObject.value._id,
          }
        },
        {
          upsert: true,
        },
      );
    }
  }

  await client.close();
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
