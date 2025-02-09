'use strict';
import { BaseMigration } from '@pe/migration-kit';

const errorNotifications: string = 'errornotifications';

export class ClearErrorNotifications extends BaseMigration {

  public async up(): Promise<void> {
    await this.connection.collection(errorNotifications).deleteMany({ });
  }

  public async down(): Promise<void> {
  }

  public description(): string {
    return 'Clear errorNotifications collection';
  }

  public migrationName(): string {
    return 'ClearErrorNotifications';
  }

  public version(): number {
    return 2;
  }
}
