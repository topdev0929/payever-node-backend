'use strict';
import { BaseMigration } from '@pe/migration-kit';

import { channelsFixture } from '../fixtures/channels.fixture';


export class AddShopwareCloudAndOroCommerceMigration extends BaseMigration {

  public async up(): Promise<void> {
    const channelsCollection: string = 'channels';
    const plugins = ['oro_commerce', 'shopware_cloud']
    const channels = channelsFixture.filter((item: any) => plugins.includes(item.type));
    if (!channels) {
      return;
    }
    for (const channel of channels) {
      
      await this.connection.collection(channelsCollection).findOneAndUpdate(
        {
          _id: channel._id,
        },
        {
          $set: channel,
        },
        {
          upsert: true,
        },
      );
    }



    return;

  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'add oro commerce and shopware cloud migration';
  };

  public migrationName(): string {
    return 'AddOroCommerceAndShopwareCloudMigration';
  };

  public version(): number {
    return 1;
  };

}
