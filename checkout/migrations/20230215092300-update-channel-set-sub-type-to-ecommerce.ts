/* eslint-disable object-literal-sort-keys */
'use strict';

import { BaseMigration } from '@pe/migration-kit';

const channelSetCollection: string = 'channelsets';
const types = [
  "api",
  "ccvshop",
  "commercetools",
  "jtl",
  "magento",
  "oxid",
  "plentymarkets",
  "presta",
  "shopware",
  "woo_commerce",
  "xt_commerce",
  "dandomain",
  "opencart"
];
export class UpdateChannelSetSubType extends BaseMigration {

  public async up(): Promise<void> {

    await this.connection.collection(channelSetCollection).updateMany({
      $and: [
        {
          type: {
            $in: types
          }
        },
        {
          subType: {
            $exists: false
          }
        }
      ]
    }, {
      $set: {
        subType: 'ecommerce'
      }
    });

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update channelset subType to ecommerce';
  }

  public migrationName(): string {
    return 'UpdateChannelSetSubTypeToEcommerce';
  }

  public version(): number {
    return 1;
  }
}
