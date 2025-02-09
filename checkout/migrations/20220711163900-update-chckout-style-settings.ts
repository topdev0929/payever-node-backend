'use strict';

import { BaseMigration } from '@pe/migration-kit';

const checkoutCollection: string = 'checkouts';

export class UpdateCheckoutStyleSettings extends BaseMigration {

  public async up(): Promise<void> {
    const checkouts: any[] =
      await this.connection.collection(checkoutCollection).find({
        $and: [
          { 'settings.styles.buttonBackgroundColor': { $exists: true}},
          { 'settings.styles.buttonSecondaryBackgroundColor': { $exists: false}},
        ],
      }).toArray();

    for (const checkout of checkouts) {
      await this.connection.collection(checkoutCollection).findOneAndUpdate(
        {
          _id: checkout._id,
        },
        {
          $set: {
            'settings.styles.buttonSecondaryBackgroundColor': checkout.settings.styles.buttonBackgroundColor,
            'settings.styles.buttonSecondaryBackgroundDisabledColor':
              checkout.settings.styles.buttonBackgroundDisabledColor
                ? checkout.settings.styles.buttonBackgroundDisabledColor : undefined,
            'settings.styles.buttonSecondaryBorderRadius': checkout.settings.styles.buttonBorderRadius
              ? checkout.settings.styles.buttonBorderRadius : undefined,
            'settings.styles.buttonSecondaryTextColor': checkout.settings.styles.buttonTextColor
              ? checkout.settings.styles.buttonTextColor : undefined,
          },
        },
      );
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update checkout style settings';
  }

  public migrationName(): string {
    return 'UpdateCheckoutStyleSettings';
  }

  public version(): number {
    return 1;
  }
}
