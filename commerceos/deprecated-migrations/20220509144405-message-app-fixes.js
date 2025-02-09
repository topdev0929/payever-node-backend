const { onboardings } = require('../fixtures/onboardings.fixture');
const { apps } = require('../fixtures/dashboard-apps.fixture');

const OUTDATED_MESSAGE_APP = '281b05ab-52db-48fc-92dc-a7f34497fbe8';

const message = apps.find(item => item.code === 'message');

export async function up(db) {

  await db._run(
    'update',
    'dashboardapps',
    {
      query: {
        _id: message._id,
      },
      update: {
        $set: message,
      },
      options: {
        upsert: true,
      },
    },
  );

  await db._run(
    'remove',
    'dashboardapps',
    {
      _id: OUTDATED_MESSAGE_APP,
    },
  );

  await db._run(
    'updateMany',
    'businesses',
    {
      query: {
        'installedApps.app': OUTDATED_MESSAGE_APP,
      },
      update: {
        $pull: {
          installedApps: {
            app: OUTDATED_MESSAGE_APP,
          },
        },
      },
    },
  );

  await db._run(
    'updateMany',
    'users',
    {
      query: {
        'installedApps.app': OUTDATED_MESSAGE_APP,
      },
      update: {
        $pull: {
          installedApps: {
            app: OUTDATED_MESSAGE_APP,
          },
        },
      },
    },
  );

  for (const onboarding of onboardings) {
    await db._run(
      'update',
      'onboardings',
      {
        query: {
          _id: onboarding._id,
        },
        update: {
          $set: {
            ...onboarding,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        options: {
          upsert: true,
        },
      },
    );
  }
}
