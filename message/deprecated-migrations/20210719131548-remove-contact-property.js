module.exports.up = async (db) => {
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        contact: {
          $eq: null,
          $exists: 1,
        },
        type: {
          $in: [
            'integration-channel',
            'app-channel',
            'channel',
            'group',
          ]
        }
      },
      update: {
        $unset: {
          contact: 1,
        },
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
