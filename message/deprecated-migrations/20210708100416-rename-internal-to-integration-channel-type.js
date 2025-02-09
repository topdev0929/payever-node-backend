module.exports.up = async (db) => {
  // drop internal-channel type
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        type: 'internal-channel',
      },
      update: {
        $set: {
          type: 'integration-channel',
        },
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
