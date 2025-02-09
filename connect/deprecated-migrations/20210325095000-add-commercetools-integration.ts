import { integrationsFixture } from '../fixtures/integrations.fixture';
import * as dotenv from 'dotenv';

const integrationsCollection: string = 'integrations';

async function up(db: any): Promise<void> {
  const fixture: any = integrationsFixture.find((integration: any) => integration.name === 'commercetools');

  const existing: Array<{}> = await db._find(integrationsCollection, { _id: fixture._id });
  if (!existing.length) {
    fixture.connect.url = getServiceUrl(fixture.connect.url);
    await db.insert('integrations', fixture);
  }

  return null;
}

function down(): Promise<void> {
  return null;
}

function getServiceUrl(identifier: string): string {
  dotenv.config();
  const regex: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url)
  }

  return url;
}

module.exports.up = up;
module.exports.down = down;
