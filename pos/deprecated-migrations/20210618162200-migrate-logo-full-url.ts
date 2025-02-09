import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const teminalsCollection = 'terminals';

async function up(db) {
  let url: string = 'https://payeverproduction.blob.core.windows.net/images/';

  if (env.APP_NAMESPACE === 'test') {
    url = 'https://payevertesting.blob.core.windows/images/';
  } else if (env.APP_NAMESPACE === 'staging') {
    url = 'https://payeverstaging.blob.core.windows.net/images/';
  }

  for (const fixture of integrationsFixture) {
    const terminals: Array<any> = await db._find(teminalsCollection, { });

    for (const terminal of terminals) {
      if (terminal.logo && terminal.logo.indexOf('http') === -1) {
        console.log(url + terminal.logo);

        await db._run(
          'update',
          teminalsCollection,
          {
            query: {_id: terminal._id},
            update: {
              $set: {
                logo: url + terminal.logo,
              }
            },
            options: {},
          },
        );
      }

    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
