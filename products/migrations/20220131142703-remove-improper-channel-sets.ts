// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';

import { channelSetBlackList } from '../src/channel-set/controllers/channel-set-bus-message.controller';

const improperChannelSets: string[] = channelSetBlackList;

export class RemoveImproperChannelSets extends BaseMigration {
  public async up(): Promise<void> {
    await this.connection.collection('channelsets').deleteMany({
      type: {
        $in: improperChannelSets,
      },
    });
  }
  public async down(): Promise<void> { }
  public description(): string {
    return `Remove improper channel sets`;
  }
  public migrationName(): string {
    return RemoveImproperChannelSets.name;
  }
  public version(): number {
    return 1;
  }
}
