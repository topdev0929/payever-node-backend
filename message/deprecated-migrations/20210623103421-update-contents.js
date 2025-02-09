const { contentsFixture } = require('../fixtures/contents.fixture');
const dotenv = require('dotenv');

function getServiceUrl(identifier) {
  dotenv.config();
  const regex = /\${(\w+)}/g;
  let url = identifier;
  let matches = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url);
  }

  return url;
}

module.exports.up = async (db) => {
  await db._run(
    'remove',
    'contents',
    {
      query: {
        business: { $exists: false },
      },
    },
  );

  for (const content of contentsFixture) {
    content.url = getServiceUrl(content.url);

    if (content.children && Array.isArray(content.children)) {
      for (let i = 0; i < content.children.length; i++) {
        content.children[i].url = getServiceUrl(content.children[i].url);
      }
    }

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
