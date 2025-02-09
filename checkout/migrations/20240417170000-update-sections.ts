'use strict';

import { BaseMigration } from "@pe/migration-kit";
import { sectionsFixture } from '../fixtures/sections.fixture';

const sectionsCollection: string = 'checkoutsections';

export class UpdateSectionsMigration extends BaseMigration {

  public async up(): Promise<void> {
    for (const fixture of sectionsFixture) {
      await this.connection.collection(sectionsCollection).updateOne(
        { _id: fixture._id },
        { $set: fixture },
        { upsert: true }
      );

    }

    return null;
  };

  public async down(): Promise<void> {
    return null;
  };

  public description(): string {
    return "Update Sections";
  };

  public migrationName(): string {
    return "UpdateSectionMigration";
  };

  public version(): number {
    return 12;
  };
}
