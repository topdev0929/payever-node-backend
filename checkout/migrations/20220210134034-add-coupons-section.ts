'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { sectionsFixture } from '../fixtures/sections.fixture';

const sectionsCollection: string = 'checkoutsections';

export class AddCouponsSectionMigration extends BaseMigration {
  public async up(): Promise<void> {
    for (const fixture of sectionsFixture) {
      if (fixture.code === 'coupons') {
        await this.connection.collection(sectionsCollection).insertOne(
          fixture,
        );
      }
    }

    return null;
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return 'Add Coupons section';
  }

  public migrationName(): string {
    return 'AddCouponsSection';
  }

  public version(): number {
    return 1;
  }
}
