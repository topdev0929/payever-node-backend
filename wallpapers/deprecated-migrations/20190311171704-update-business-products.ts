import { v4 as uuid } from 'uuid';

import { products } from '../fixtures/business-products.fixture';

const productsCollection = 'businessproductwallpapers';

async function up(db) {
  for (const product of products) {
    product.industries.forEach((x: any) => x._id = uuid());
    await db._run(
      'update',
      productsCollection,
      {
        query: { _id: product._id },
        update: { $set: { industries: product.industries } },
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
