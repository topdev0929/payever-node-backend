module.exports.up = async (db: any) => {
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        type: 'integration-channel',
      },
      update: {
        $set: {
          contacts: [],
          integrationName: 'internal',
          subType: 'private',
          type: 'channel',
        },
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
