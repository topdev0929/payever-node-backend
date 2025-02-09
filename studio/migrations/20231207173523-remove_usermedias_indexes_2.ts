'use strict';

import { BaseMigration } from "@pe/migration-kit";

export class RemoveUserMediasIndexes2 extends BaseMigration {

  public async up(): Promise<void> {
    const indexesToRemove = [
      'name_1_url_1_businessId_1',
      'name_1_url_1_business_1',
      'url_1_business_1',
      'url_1_businessId_1',
    ];
    for (const index of indexesToRemove) {
      try {
        await this.connection.collection('usermedias').dropIndex(index);
      } catch (error) { }
    }    
  };

  public async down(): Promise<void> {

    return null;
  };

  public description(): string {
    return "RemoveUserMediasIndexes2";
  };

  public migrationName(): string {
    return "RemoveUserMediasIndexes2";
  };

  public version(): number {
    return 1;
  };

}
