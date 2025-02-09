const { templatesFixture } = require('../fixtures/templates.fixture');

module.exports.up = async (db) => {
  for (const templatePrototype of templatesFixture) {
    await db._run(
      'update',
      'chattemplates',
      {
        query: { _id: templatePrototype._id },
        update: templatePrototype,
        options: { upsert: true },
      },
    );
    for (const message of templatePrototype.messages) {
      await db._run(
        'update',
        'chatmessagetemplates',
        {
          query: { _id: message._id },
          update: message,
          options: {
            upsert: true,
          },
        },
      );
    }
  }
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
