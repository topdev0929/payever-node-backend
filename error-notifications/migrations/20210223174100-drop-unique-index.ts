'use strict';
import { BaseMigration } from '@pe/migration-kit';

const errorNotifications: string = 'errornotifications';

export class ClearErrorNotifications extends BaseMigration {

  public async up(): Promise<void> {
    if (await this.connection.collection(errorNotifications).indexExists('businessId_1_type_1_integration_1')) {
      await this.connection.collection(errorNotifications).dropIndex('businessId_1_type_1_integration_1');
    }
  }

  public async down(): Promise<void> {
  }

  public description(): string {
    return 'drop unique index';
  }

  public migrationName(): string {
    return 'DropUniqueIndex';
  }

  public version(): number {
    return 2;
  }
}
