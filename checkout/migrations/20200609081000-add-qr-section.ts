'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { sectionsFixture } from '../fixtures/sections.fixture';
import { CheckoutSection } from '../src/integration';

const sectionsCollection: string = 'checkoutsections';

export class AddQrSectionMigration extends BaseMigration {
  public async up(): Promise<void> {
    for (const fixture of sectionsFixture) {
      if (fixture.code === CheckoutSection.Qr) {
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
    return 'Add QR section';
  }

  public migrationName(): string {
    return 'AddQrSection';
  }

  public version(): number {
    return 1;
  }
}
