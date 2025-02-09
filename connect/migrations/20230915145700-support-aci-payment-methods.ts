'use strict';

import { integrationsFixture } from '../fixtures/integrations.fixture';
import { BaseMigration } from '@pe/migration-kit';
import * as dotenv from 'dotenv';

const integrationsCollection: string = 'integrations';
const integrations: string[] = [
  'nets',
];

export class SupportAciPaymentMethods extends BaseMigration {

  public async up(): Promise<void> {

    const fixtures: any[] = integrationsFixture.filter((integration: any) => {
      return integrations.includes(integration.name);
    });

    for (const fixture of fixtures) {
      fixture.connect.url = this.getServiceUrl(fixture.connect.url);
      if (fixture?.extension?.url) {
        fixture.extension.url = this.getServiceUrl(fixture.extension.url);
      }

      // Just for aci payment methods - remove old version of integrations
      await this.connection.collection(integrationsCollection).deleteMany(
        { name: fixture.name },
      );
      
      await this.connection.collection(integrationsCollection).findOneAndUpdate(
        {
          _id: fixture._id,
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
    return 'Support aci payment methods';
  };

  public migrationName(): string {
    return 'SupportAciPaymentMethods';
  };

  public version(): number {
    return 6;
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

