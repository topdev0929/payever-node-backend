export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('inventories', 'business_1');
    await db.removeIndex('inventories', 'business_1_sku_1');
  } catch (e) {}

  await db._run('update', 'inventories', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      upsert: false,
      multi: true,
    },
  });

  try {
    await db.removeIndex('orders', 'business_1');
  } catch (e) {}

  await db._run('update', 'orders', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      upsert: false,
      multi: true,
    },
  });

  await db._run('update', 'reservations', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      upsert: false,
      multi: true,
    },
  });
}

export async function down(): Promise<void> { }

module.exports.up = up;
module.exports.down = down;
