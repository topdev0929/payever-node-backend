import * as dotenv from 'dotenv';

import { integrationsFixture } from '../fixtures/integrations.fixture';
import { IntegrationPrototype } from '../fixtures/integration-prototype.interface';

const collectionName: string = 'integrations';
const integrationName: string = 'email';

export async function up(db: any): Promise<void> {
  const emailIntegration: IntegrationPrototype = integrationsFixture.find(
    (integration: IntegrationPrototype) => integration.name === integrationName,
  );

  dotenv.config();

  const re: RegExp = /\${(\w+)}/g;
  emailIntegration.connect.url = emailIntegration.connect.url.replace(
    re, (substr: string, var1: string) => process.env[var1],
  );

  await db._run('update', collectionName, {
    query: {
      _id: emailIntegration._id,
    },
    update: {
      $set: emailIntegration,
    },
    options: {
      upsert: true,
    },
  });
}

export async function down(): Promise<void> { }
