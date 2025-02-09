import { v4 as uuid } from 'uuid';

import { products } from '../fixtures/business-products.fixture';

const productsCollection = 'businessproducts';

async function up(db) {
  for (const product of products) {
    product.industries.forEach((x: any) => x._id = uuid());
    await db._run('insert', productsCollection, product);
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
