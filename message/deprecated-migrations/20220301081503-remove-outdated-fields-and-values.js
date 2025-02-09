exports.up = async function(db) {
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        type: 'integration-channel',
      },
      update: {
        $unset: {
          'subType': 1,
          'integrationName': 1
        },
      },
    }
  )

  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        type: 'app-channel',
      },
      update: {
        $unset: {
          'subType': 1,
          'integrationName': 1,
        },
      },
    },
  );

  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        subType: 'integration',
        type: {
          $ne: 'integration-channel',
        },
      },
      update: {
        $set: {
          subType: 'private',
        },
      },
    },
  );

  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        parentFolderId: {
          $exists: 1,
        },
      },
      update: {
        $unset: {
          parentFolderId: 1,
        },
      },
    },
  );
};

exports.down = function(db) {
  return null;
};
