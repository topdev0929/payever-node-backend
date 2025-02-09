async function up(db) {
  try {
    await db.removeIndex('channelsets', 'business_1');
  } catch (e) { }

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

  await db._run('update', 'shippingboxes', {
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
    await db.removeIndex('shippingorders', 'business_1');
  } catch (e) { }

  await db._run('update', 'shippingorders', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
        'shippingMethod.business': 'shippingMethod.businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('shippingsettings', 'business_1');
  } catch (e) { }

  await db._run('update', 'shippingsettings', {
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
    await db.removeIndex('shippingtasks', 'business_1_integration_1');
  } catch (e) { }

  await db._run('update', 'shippingtasks', {
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

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
