const { contentsFixture } = require('../fixtures/contents.fixture');

module.exports.up = async (db) => {
  await db._run(
    'remove',
    'contents',
    {
      query: { },
    },
  );

  for (const content of contentsFixture) {
    await db._run(
      'update',
      'contents',
      {
        query: { _id: content._id },
        update: content,
        options: {
          upsert: true,
        }
      }
    )
  }
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
