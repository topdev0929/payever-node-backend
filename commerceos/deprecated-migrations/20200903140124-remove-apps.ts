const dashboardAppsCollection: string = 'dashboardapps';

export async function up(db) {
  await db._run(
    'update',
    dashboardAppsCollection,
    {
      query: {
        code: 'contacts',
      },
      update: {
        $set: {
          'bootstrapScriptUrl': null,
        },
      },
    },
  );

  await db._run(
    'update',
    dashboardAppsCollection,
    {
      query: {
        code: 'coupons',
      },
      update: {
        $set: {
          'bootstrapScriptUrl': null,
        },
      },
    },
  );

  await db._run(
    'update',
    dashboardAppsCollection,
    {
      query: {
        code: 'builder',
      },
      update: {
        $set: {
          'bootstrapScriptUrl': null,
        },
      },
    },
  );

  await db._run(
    'update',
    dashboardAppsCollection,
    {
      query: {
        code: 'pos-client',
      },
      update: {
        $set: {
          'bootstrapScriptUrl': null,
        },
      },
    },
  );

  return null;
}

export function down() {
  return null;
}
