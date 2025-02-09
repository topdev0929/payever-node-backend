const oldProductsCollection: string = 'businessproductwallpapers';
const newProductsCollection: string = 'business-products';
const productIndustriesCollection: string = 'business-products-industries';

async function up(db) {
  const oldProducts: any[] = await db._run('find', oldProductsCollection, {});

  for (const product of oldProducts) {
    await db._run(
      'update',
      productIndustriesCollection,
      {
        query: { _id: product._id },
        update: { $set: {
            _id: product._id,
            code: product.code,
            order: product.order,
          }
        },
        options: { upsert: true },
      },
    );

    for (const industry of product.industries) {
      const data: any = Object.assign(industry, { industry: product._id });
      await db._run(
        'update',
        newProductsCollection,
        {
          query: { _id: data._id },
          update: { $set: data },
          options: { upsert: true },
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
