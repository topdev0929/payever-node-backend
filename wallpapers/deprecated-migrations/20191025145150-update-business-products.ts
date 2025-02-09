import { v4 as uuid } from 'uuid';

import { products } from '../fixtures/business-products.fixture';

const productsCollection = 'businessproductwallpapers';

async function up(db) {
  for (const product of products) {
    await db._run(
      'update',
      productsCollection,
      {
        query: { _id: product._id },
        update: { $set: { order: product.order } },
        options: {},
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
