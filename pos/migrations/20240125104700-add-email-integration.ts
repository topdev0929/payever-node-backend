'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { integrationsFixture } from '../fixtures/integrations.fixture';
import { IntegrationModel } from '../src/integration/models';
import { DocumentDefinition } from 'mongoose';

export class AddEmailIntegrations extends BaseMigration {

  public async up(): Promise<void> {
    const integrationsCollection: string = 'integrations';

    const integrationEmail: DocumentDefinition<IntegrationModel> =
      integrationsFixture.find((item: DocumentDefinition<IntegrationModel>) => item.name === 'email');

    const existing: Array<{ }> = await this.connection.collection(integrationsCollection).find(
      {
        _id : integrationEmail._id,
      },
    ).toArray();

    if (!existing.length) {
       await this.connection.collection(integrationsCollection).insertOne(integrationEmail);
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Add Email Integration';
  }

  public migrationName(): string {
    return 'AddEmailIntegration';
  }

  public version(): number {
    return 1;
  }
}
