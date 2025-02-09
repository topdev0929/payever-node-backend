const { botsFixture } = require('../fixtures/bot.fixture');

module.exports.up = async (db) => {
  for (const bot of botsFixture) {
    await db._run(
      'update',
      'bots',
      {
        query: { _id: bot._id },
        update: bot,
        options: {
          upsert: true,
        },
      },
    );
  }
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
