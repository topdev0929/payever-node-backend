/* eslint-disable object-literal-sort-keys */
'use strict';

import { BaseMigration } from '@pe/migration-kit';

const checkoutCollection: string = 'checkouts';

export class UpdateCheckoutStyleSettings extends BaseMigration {

  public async up(): Promise<void> {
    const checkoutsDesktopMobile: any[] =
      await this.connection.collection(checkoutCollection).find({
        $and: [
          { 'settings.styles': { $exists: true}},
          { 'settings.styles.businessHeaderDesktopHeight': { $exists: false}},
        ],
      }).toArray();

    for (const checkout of checkoutsDesktopMobile) {
      await this.connection.collection(checkoutCollection).findOneAndUpdate(
        {
          _id: checkout._id,
        },
        {
          $set: {
            'settings.styles.businessHeaderDesktopHeight': 55,
            'settings.styles.businessHeaderMobileHeight': 55,
            'settings.styles.businessLogoDesktopPaddingTop': 0,
            'settings.styles.businessLogoDesktopPaddingRight': 0,
            'settings.styles.businessLogoDesktopPaddingBottom': 0,
            'settings.styles.businessLogoDesktopPaddingLeft': 0,
            'settings.styles.businessLogoDesktopAlignment': 'left',
            'settings.styles.businessLogoMobileWidth': 0,
            'settings.styles.businessLogoMobileHeight': 0,
            'settings.styles.businessLogoMobilePaddingTop': 0,
            'settings.styles.businessLogoMobilePaddingRight': 0,
            'settings.styles.businessLogoMobilePaddingBottom': 0,
            'settings.styles.businessLogoMobilePaddingLeft': 0,
            'settings.styles.businessLogoMobileAlignment': 'left',
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
    return 'UpdateCheckoutStyleSettingsDesktopMobile';
  }

  public version(): number {
    return 1;
  }
}
