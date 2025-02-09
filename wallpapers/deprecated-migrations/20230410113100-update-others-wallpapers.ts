import { MongoClient, Db } from 'mongodb';
import { products } from '../fixtures/business-products.fixture';

const productsCollection = 'businessproductwallpapers';
const businessProductsCollection = 'business-products';

async function up(db) {
  const client: MongoClient = new MongoClient(
    db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true },
  );
  await client.connect();
  const connectDB: Db = await client.db();

  for (const product of products) {
    if (product.code !== 'BUSINESS_PRODUCT_OTHERS') {
      continue;
    }

    await connectDB.collection(productsCollection).findOneAndUpdate(
      { code: product.code},
      { $set: { industries: product.industries }},
      { upsert: true},
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

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
