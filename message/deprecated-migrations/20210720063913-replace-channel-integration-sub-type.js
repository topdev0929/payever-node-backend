module.exports.up = async (db) => {
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
          type: 'integration-channel',
        }
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
