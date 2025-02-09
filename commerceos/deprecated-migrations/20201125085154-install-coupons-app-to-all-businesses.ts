export async function up(db) {
  // 3. set `installed` for all businesses
  await db._run(
    'updateMany',
    'businesses',
    {
      query: {
        installedApps: {
          $elemMatch: {
            code: 'coupons',
            installed: false,
          },
        },
      },
      update: {
        $set: {
          'installedApps.$.installed': true,
        },
      },
    },
  );
}

export async function down() {
  return null;
}
