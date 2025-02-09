const businessesCollection: string = 'businesses';
const defaultappsCollection: string = 'defaultapps';

export async function up(db) {
  await db._run('updateMany', businessesCollection, {
    query: {
      "installedApps": {
        $elemMatch: {
          "code": "transactions",
          "setupStatus": { $in: ["notStarted", "started"]}
        }
      }
    },
    update: {
      $set: {
        "installedApps.$.setupStatus" : "completed",
      },
    },
  });

  await db._run('updateMany', defaultappsCollection, {
    query: {
      "installedApps": {
        $elemMatch: {
          "code": "transactions"
        }
      }
    },
    update: {
      $set: {
        "installedApps.$.setupStatus" : "completed",
      },
    },
  });

  return null;
}

export function down() {
  return null;
}
