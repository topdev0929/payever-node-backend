module.exports.up = async (db) => {
  await db._run(
    'updateMany',
    'chatmessagetemplates',
    {
      query: {
        'interactive.marked': {
          $exists: 1,
        }
      },
      update: {
        $unset: {
          'interactive.marked': 1,
        },
      },
    },
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
