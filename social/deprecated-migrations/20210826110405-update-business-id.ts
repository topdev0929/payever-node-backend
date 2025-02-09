// tslint:disable: object-literal-sort-keys
async function up(db: any): Promise<any> {
  try {
    await db.removeIndex('channelsets', 'business_1');
  } catch (e) { }

  await db._run('update', 'channelsets', {
    query: { },
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
    await db.removeIndex('posts', 'business_1');
  } catch (e) { }

  await db._run('update', 'posts', {
    query: { },
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

function down(): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
