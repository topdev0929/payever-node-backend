const { integrationsFixture } = require('../fixtures/integrations.fixture');

const chatsCollection = 'chats';

module.exports.up = async (db) => {
  const chats = await db._find(chatsCollection, { });

  for (const chat of chats) {
    await db._run(
      'update',
      chatsCollection,
      {
        query: { _id: chat._id },
        update: {
          $set: {
            members: chat.members.map(id => ({
              user: id,
              role: 'admin',
            })),
          },
        },
        options: {
          upsert: true,
        }
      }
    )
  }
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
