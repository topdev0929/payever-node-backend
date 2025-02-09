'use strict';

import { BaseMigration } from "@pe/migration-kit";
import { integrationsFixture } from '../fixtures/integrations.fixture';

const integrationsCollection: string = 'integrations';

export class UpdateIntegrationMigration extends BaseMigration {

  public async up(): Promise<void> {

    for (const fixture of integrationsFixture) {
      const existing: any[] = await this.connection.collection(integrationsCollection)
        .find({ _id : fixture._id }).toArray();
  
      if (!existing.length) {
        console.log(1)
        await this.connection.collection(integrationsCollection).insertOne(fixture);
      }
    }

    return null;
  };

  public async down(): Promise<void> {

    return null;
  };

  public description(): string {
   return "Update Integration add integration if not exists";
  };

  public migrationName(): string {
   return "UpdateIntegrationMigration";
  };

  public version(): number {
   return 1;
  };

}
