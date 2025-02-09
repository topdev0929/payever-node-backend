'use strict';

import { BaseMigration } from '@pe/migration-kit';

export class SyncCategoryIndexes extends BaseMigration {

  public async up(): Promise<void> {
    await this.connection.model('Category').syncIndexes();
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
   return '';
  }

  public migrationName(): string {
   return 'SyncCategoryIndexes';
  }

  public version(): number {
   return 1;
  }

}
