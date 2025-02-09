/* tslint:disable:object-literal-sort-keys */
export async function up(db: any): Promise<void> {
  await db._run('update', 'channelsets', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('businessmonthamounts', 'business_1');
    await db.removeIndex('businessmonthamounts', 'business_1_date_1');
  } catch (e) { }

  await db._run('update', 'businessmonthamounts', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('businessdayamounts', 'business_1');
    await db.removeIndex('businessdayamounts', 'business_1_date_1');
  } catch (e) { }

  await db._run('update', 'businessdayamounts', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('businessmedias', 'business_1');
  } catch (e) { }

  await db._run('update', 'businessmedias', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('businessproductaggregates', '_id_1_business_1');
    await db.removeIndex('businessproductaggregates', 'business_1');
    await db.removeIndex('businessproductaggregates', 'business_1_lastSell_-1');
  } catch (e) { }

  await db._run('update', 'businessproductaggregates', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('campaigns', 'business_1');
  } catch (e) { }

  await db._run('update', 'campaigns', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  await db._run('update', 'connectintegrationsubscriptions', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });
}

export async function down(): Promise<void> { }

module.exports.up = up;
module.exports.down = down;
