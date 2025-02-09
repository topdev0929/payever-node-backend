// tslint:disable: object-literal-sort-keys
import * as dotenv from 'dotenv';

import { templatesFixture } from '../fixtures/templates.fixture';

function getServiceUrl(identifier: string): string {
  dotenv.config();
  const regex: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url);
  }

  return url;
}

module.exports.up = async (db: any) => {
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
