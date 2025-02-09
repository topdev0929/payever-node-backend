'use strict';

import { BaseMigration } from '@pe/migration-kit';

const checkoutCollection: string = 'checkouts';

export class UpdateCheckoutSettingsMigration extends BaseMigration {

  public async up(): Promise<void> {


    await this.connection.collection(checkoutCollection).updateMany(
      { 'settings.enableCustomerAccount': { $exists: false } },
      {
        $set: {
          'settings.enableCustomerAccount': true,
          'settings.enableDisclaimerPolicy': false,
          'settings.enableLegalPolicy': false,
          'settings.enablePayeverTerms': true,
          'settings.enablePrivacyPolicy': false,
          'settings.enableRefundPolicy': false,
          'settings.enableShippingPolicy': false,
        }
      },
    );


    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update checkout settings';
  }

  public migrationName(): string {
    return 'UpdateCheckoutSettingsMigration';
  }

  public version(): number {
    return 1;
  }
}
