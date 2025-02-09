'use strict';
import { BaseMigration } from '@pe/migration-kit';

const channelsCollection: string = 'channels';
export class AddChannelsMigration extends BaseMigration {

  public async up(): Promise<void> {
   await this.connection
     .collection(channelsCollection)
     .findOneAndUpdate(
       {
          type: 'finance-express',
       },
       {
         $set: { type: 'finance_express' },
       },
     );
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return 'Renames subscription channels';
  }

  public migrationName(): string {
    return 'RenameChannelsMigration';
  }

  public version(): number {
    return 1;
  }
}
