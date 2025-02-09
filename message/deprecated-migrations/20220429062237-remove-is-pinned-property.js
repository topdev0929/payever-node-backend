module.exports.up = async (db) => {
  await db._run(
    'updateMany',
    'chatmessages',
    {
      query: {
        isPinned: {
          $exists: 1,
        },
      },
      update: {
        $unset: {
          isPinned: 1,
        },
      }
    },
  );
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
