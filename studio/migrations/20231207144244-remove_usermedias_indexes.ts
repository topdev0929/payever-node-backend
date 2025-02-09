'use strict';

import { BaseMigration } from "@pe/migration-kit";

export class RemoveUserMediasIndexes extends BaseMigration {

  public async up(): Promise<void> {
    try {
      await this.connection.collection('usermedias').dropIndex('name_1_url_1_business_1');
    } catch (error) { }
  };

  public async down(): Promise<void> {

    return null;
  };

  public description(): string {
   return "RemoveUserMediasIndexes";
  };

  public migrationName(): string {
   return "RemoveUserMediasIndexes";
  };

  public version(): number {
   return 1;
  };

}
