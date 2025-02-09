'use strict';
import { BaseMigration } from '@pe/migration-kit';

const channelsCollection: string = 'channels';
export class AddChannelsMigration extends BaseMigration {

  public async up(): Promise<void> {
   await this.connection
     .collection(channelsCollection)
     .insertOne({
        _id: '973b9295-45cf-4195-b338-c9114cc7b9c1',
        createdAt: new Date(),
        enabled: true,
        enabledByDefault: false,
        type: 'finance-express',
        updatedAt: new Date(),
     });
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return 'Adds subscription channels';
  }

  public migrationName(): string {
    return 'AddChannelsMigration';
  }

  public version(): number {
    return 1;
  }
}
