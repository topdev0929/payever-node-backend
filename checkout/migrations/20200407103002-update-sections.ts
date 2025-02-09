'use strict';

import { BaseMigration } from "@pe/migration-kit";
import { sectionsFixture } from '../fixtures/sections.fixture';

const sectionsCollection: string = 'checkoutsections';

export class UpdateSectionsMigration extends BaseMigration {

  public async up(): Promise<void> {
    for (const fixture of sectionsFixture) {
      if (fixture.code === 'order') {
        await this.connection.collection(sectionsCollection).updateOne(
          { _id: fixture._id },
          { $set: { excluded_channels: fixture.excluded_channels } },
        );
      }
    }
    return null;
  };

  public async down(): Promise<void> {

    return null;
  };

  public description(): string {
    return "Update Sections where code is order";
  };

  public migrationName(): string {
   return "UpdateSectionsMigration";
  };

  public version(): number {
   return 1;
  };

}
