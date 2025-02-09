import { products } from '../fixtures/business-products.fixture';

const productsCollection = 'businessproductwallpapers';

async function up(db) {
  for (const product of products) {
    if (product.code !== 'BUSINESS_PRODUCT_SERVICES') {
      continue;
    }

    await db._run(
      'update',
      productsCollection,
      {
        query: { _id: product._id },
        update: { $set: { industries: product.industries } },
        options: { },
      },
    );
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
