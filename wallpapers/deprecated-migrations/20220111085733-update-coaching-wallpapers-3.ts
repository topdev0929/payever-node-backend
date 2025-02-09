import { Db, MongoClient } from 'mongodb';

import { products } from '../fixtures/business-products.fixture';

const businessProductsIndustriesCollection = 'business-products-industries';
const businessProductsCollection = 'business-products';

async function up(db) {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  for (const product of products) {
    console.log('product', product);
    // 1. Remove all
    await connectDB.collection(businessProductsIndustriesCollection).deleteMany({
      code: product.code,
    });

    for (const industry of product.industries) {
      await connectDB.collection(businessProductsCollection).deleteMany({
        code: industry.code,
      });
    }

    // 2. Recreate all
    await connectDB.collection(businessProductsIndustriesCollection).findOneAndUpdate(
      {
        _id: product._id,
      },
      {
        $set: {
          code: product.code,
          order: product.order,
          icon: product.icon,
        },
      },
      {
        upsert: true,
      },
    );

    for (const industry of product.industries) {
      await connectDB.collection(businessProductsCollection).findOneAndUpdate(
        {
          _id: industry._id,
        },
        {
          $set: {
            code: industry.code,
            industry: product._id,
            wallpapers: (industry.wallpapers || []).map(item => ({
              wallpaper: item,
            })),
          },
        },
        {
          upsert: true,
        },
      );
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
