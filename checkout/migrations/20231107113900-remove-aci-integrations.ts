'use strict';

import { BaseMigration } from '@pe/migration-kit';

const integrationsCollection: string = 'integrations';
const businessIntegrationSubscriptionsCollection: string = 'businessintegrationsubscriptions';
const checkoutIntegrationSubscriptionsCollection: string = 'checkoutintegrationsubscriptions';
const connectionsCollection: string = 'connections';

export class RemoveAciIntegrationsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const integrationsNamesToRemove: string[] = [
      'concardis',
      'payone',
    ];

    const integrationsSubscriptionsToRemove: string[] = [
      '6b3ed8fe-6523-424a-9e4a-d5887e702d2d',
      '798d6b10-cb8c-44a2-8108-0ad022e19edc',
    ];

    for (const integrationSubscriptionId of integrationsSubscriptionsToRemove) {
      await this.connection.collection(businessIntegrationSubscriptionsCollection).deleteMany(
        {
          integration: integrationSubscriptionId,
        }
      );
      await this.connection.collection(checkoutIntegrationSubscriptionsCollection).deleteMany(
        {
          integration: integrationSubscriptionId,
        }
      );
      await this.connection.collection(connectionsCollection).deleteMany(
        {
          integration: integrationSubscriptionId,
        }
      );
    }

    for (const integrationName of integrationsNamesToRemove) {
      await this.connection.collection(integrationsCollection).deleteMany(
        {
          name: integrationName,
          issuer: 'aci',
        }
      );
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Remove aci integration';
  }

  public migrationName(): string {
    return 'RemoveAciIntegrationMigration';
  }

  public version(): number {
    return 4;
  }
}
