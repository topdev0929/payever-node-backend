module.exports.up = async (db) => {
  await db._run(
    'updateMany',
    'chatmessages',
    {
      query: { type: {$exists: 0 } },
      update: {
        $set: {
          type: 'text',
        },
      }
    },
  );
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
