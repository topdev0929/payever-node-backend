// tslint:disable object-literal-sort-keys
export async function up(db: any): Promise<void> {
  await db._run('update', 'categories', {
    query: {
      businessUuid: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        businessUuid: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  await db._run('update', 'products', {
    query: {
      businessUuid: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        businessUuid: 'businessId',
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
