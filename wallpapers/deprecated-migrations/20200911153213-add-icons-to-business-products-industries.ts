/*
 * Moved icons to fixture
 */

const productIndustriesCollection: string = 'business-products-industries';

export async function up(db) {
  const industries: any[] = [
    {
      code: 'BUSINESS_PRODUCT_RETAIL_B2C',
      icon: 'retail_b2c',
    },
    {
      code: 'BUSINESS_PRODUCT_RETAIL_B2B',
      icon: 'retail_b2b',
    },
    {
      code: 'BUSINESS_PRODUCT_SERVICES',
      icon: 'services',
    },
    {
      code: 'BUSINESS_PRODUCT_FOOD',
      icon: 'food',
    },
    {
      code: 'BUSINESS_PRODUCT_DRINKS',
      icon: 'drinks',
    },
    {
      code: 'BUSINESS_PRODUCT_OVERNIGHT_STAY',
      icon: 'overnight_stay',
    },
    {
      code: 'BUSINESS_PRODUCT_MEALS',
      icon: 'meals',
    },
    {
      code: 'BUSINESS_PRODUCT_GIDITAL_GOODS',
      icon: 'digitalgoods',
    },
    {
      code: 'BUSINESS_PRODUCT_OTHERS',
      icon: 'others',
    },
  ];

  for (const industry of industries) {
    await db._run(
      'update',
      productIndustriesCollection,
      {
        query: { code: industry.code },
        update: {
          $set: {
            icon: industry.icon,
          },
        },
      },
    );
  }

  return null;
}

export function down(): any {
  return null;
}
