module.exports.up = async (db) => {
  // find channel with 'app' and type = 'channel' and change type to `app-channel`
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        app: {
          $exists: true,
        },
        template: {
          $exists: true,
        },
        type: 'channel',
      },
      update: {
        $set: {
          type: 'app-channel',
        },
      },
    },
  );

  // find channel with `subType` = 'integration' and change type to 'internal-channel'
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        subType: 'integration',
        type: 'channel',
      },
      update: {
        $set: {
          type: 'internal-channel',
        },
      },
    },
  );

  //  clean invite codes
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        inviteCode: {
          $exists: 1,
        },
      },
      update: {
        $unset: {
          inviteCode: 1,
        },
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
