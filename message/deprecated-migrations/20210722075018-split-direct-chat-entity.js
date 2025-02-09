module.exports.up = async (db) => {
  //  extract direct-chats from chats
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        contact: null,
        type: 'chat',
      },
      update: {
        $set: {
          type: 'direct-chat',
        }
      },
    },
  );

  // remove `integrationName` property from some types of messaging
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        integrationName: { $exists: 1 },
        type: {
          $in: ['app-channel', 'direct-chat', 'group'],
        },
      },
      update: {
        $unset: {
          integrationName: 1,
        }
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
