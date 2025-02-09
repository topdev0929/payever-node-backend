'use strict';
import { BaseMigration } from '@pe/migration-kit';

import { channelsFixture } from '../fixtures/channels.fixture';


export class AddSmartstoreMigration extends BaseMigration {

  public async up(): Promise<void> {
    const channelsCollection: string = 'channels';
    const plugins = ['smartstore']
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
    return 'add smartstore';
  };

  public migrationName(): string {
    return 'AddSmartstoreMigration';
  };

  public version(): number {
    return 1;
  };

}
