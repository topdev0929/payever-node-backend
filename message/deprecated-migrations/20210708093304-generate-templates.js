const blake2 = require('blake2');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');

const { MessagingIntegrationsEnum, MessagingTypeEnum } = require('@pe/message-kit');
const { templatesFixture } = require('../fixtures/templates.fixture');

const ALGORITHM = 'aes-256-cbc';

function generateHash(password) {
  const hash = blake2.createHash('blake2b');

  hash.update(Buffer.from(password));

  return hash.digest('hex');
}
function generateKeyAndIV(hash) {
  let key = hash.substr(0, 64);
  key = Buffer.from(key);
  key = key.slice(0, 32);

  let iv = hash.substr(64, 32);
  iv = Buffer.from(iv);
  iv = iv.slice(0, 16);

  return {
    iv: iv.toString('hex'),
    key: key.toString('hex'),
  };
}
async function encryptWithSalt(text, salt) {
  const {
    key,
    iv,
  } = generateKeyAndIV(generateHash(salt));

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex'),
  );
  let encryptedText = cipher.update(text);
  encryptedText = Buffer.concat([encryptedText, cipher.final()]);

  return encryptedText.toString('hex');
}

module.exports.up = async (db) => {
  const mapMessages = {};
  for (const fixture of templatesFixture) {
    mapMessages[fixture._id] = fixture.messages;

    await db._run(
      'update',
      'chattemplates',
      {
        query: { _id: fixture._id },
        update: fixture,
        options: {
          upsert: true,
        },
      },
    );

    for (const message of fixture.messages) {
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

  // find all businesses
  const businesses = await db._run(
    'find',
    'businesses',
    { },
  );

  const channels = [];
  for (const fixture of templatesFixture) {
    for (const business of businesses) {
      channels.push({
        app: fixture.app,
        title: fixture.title,
        description: fixture.description,

        _id: uuid(),
        business: business._id,
        contact: null,
        expiresAt: null,
        integrationName: MessagingIntegrationsEnum.Internal,
        template: fixture._id,
        salt: uuid(),
        subType: 'public',
        type: MessagingTypeEnum.AppChannel,
        signed: false,
        photo: '',
      });
    }
  }

  // Insert channels in bulk
  await db._run(
    'insert',
    'chats',
    channels,
  );

  // Get created channels
  const createdChannels = await db._run(
    'find',
    'chats',
    {
      template: { $exists: true },
      type: MessagingTypeEnum.AppChannel,
    },
  );

  const messages = [];
  for (const channel of createdChannels) {
    if (mapMessages[channel.template] && mapMessages[channel.template].length > 0) {
      for (const chatMessageTemplate of mapMessages[channel.template]) {
        messages.push({
          ...chatMessageTemplate,

          _id: uuid(),
          chat: channel._id,
          content: await encryptWithSalt(chatMessageTemplate.content || '', channel.salt),
          sentAt: new Date(),
          template: chatMessageTemplate._id,
        });
      }
    }
  }

  // Insert messages in bulk
  await db._run(
    'insert',
    'chatmessages',
    messages,
  );
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };
