'use strict';

import { integrationsFixture } from '../fixtures/integrations.fixture';
import { BaseMigration } from '@pe/migration-kit';
import * as dotenv from 'dotenv';

const integrationsCollection: string = 'integrations';

export class AddSantanderB2BIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {

    const fixtures: any[] = integrationsFixture.filter((integration: any) => {
      return ['psa_b2b_bnpl'].includes(integration.name);
    });

    for (const fixture of fixtures) {
      fixture.connect.url = this.getServiceUrl(fixture.connect.url);
      if (fixture?.extension?.url) {
        fixture.extension.url = this.getServiceUrl(fixture.extension.url);
      }

      const existingIntegration: any = await this.connection.collection(integrationsCollection).findOne(
        { name: fixture.name},
      );

      const integrationId: string = existingIntegration ? existingIntegration._id : fixture._id;
      fixture._id = integrationId;

      await this.connection.collection(integrationsCollection).findOneAndUpdate(
        {
          _id: integrationId,
        },
        {
          $set: fixture,
        },
        {
          upsert: true,
        },
      );
    }

    return;
  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'Add Santander B2B integrations migration';
  };

  public migrationName(): string {
    return 'AddSantanderB2BIntegrationsMigration';
  };

  public version(): number {
    return 1;
  };

  private getServiceUrl(identifier: string): string {
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
}
