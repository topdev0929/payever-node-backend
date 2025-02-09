'use strict';
import { BaseMigration } from '@pe/migration-kit';

import { channelsFixture } from '../fixtures/channels.fixture';


export class AddOpenCartMigration extends BaseMigration {

  public async up(): Promise<void> {
    const channelsCollection: string = 'channels';

    const channel = channelsFixture.find((item: any) => item.type === 'opencart');

    if (!channel) {
      return;
    }

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

    return;

  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'add opencart migration';
  };

  public migrationName(): string {
    return 'AddOpenCartMigration';
  };

  public version(): number {
    return 1;
  };

}
