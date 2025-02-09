const oldProductsCollection: string = 'businessproducts';
const newProductsCollection: string = 'business-products';
const productIndustriesCollection: string = 'business-products-industries';

async function up(db) {
  const oldProducts: any[] = await db._run('find', oldProductsCollection, {});

  for (const product of oldProducts) {
    await db._run(
      'insert',
      productIndustriesCollection,
      {
        _id: product._id,
        code: product.code,
        order: product.order,
      },
    );

    for (const industry of product.industries) {
      await db._run(
        'insert',
        newProductsCollection,
        Object.assign(industry, { industry: product._id }),
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
