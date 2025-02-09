const appName = 'site';

export async function up(db) {
  // Step 2. Setting app is installed by default
  await db._run(
    'update',
    'defaultapps',
    {
      query: {
        _id: 'business',
        'installedApps.code': appName,
      },
      update: {
        $set: {
          'installedApps.$.installed': true,
        },
      },
    },
  );

  // 3. set `installed` for all businesses
  await db._run(
    'updateMany',
    'businesses',
    {
      query: {
        installedApps: {
          $elemMatch: {
            code: appName,
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

export const down = async (db) => {};
