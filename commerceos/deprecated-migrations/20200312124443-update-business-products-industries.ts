import { products } from '../fixtures/business-products.fixture';

const productsCollection = 'businessproducts';

async function up(db) {
  for (const product of products) {
    for (const industry of product.industries) {
      await db._run(
        'update',
        productsCollection,
        {
          query: {
            code: product.code,
            'industries.code': industry.code,
          },
          update: {
            $set: {
              'industries.$.logo': industry.logo,
              'industries.$.slug': industry.slug,
              'industries.$.wallpaper': industry.wallpaper,
            },
          },
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
