'use strict';

import { BaseMigration } from '@pe/migration-kit';

export class UpdateChannelSets extends BaseMigration {

  public async up(): Promise<void> {
    const terminalCollection: string = 'terminals';

    const terminals: any[] = await this.connection.collection(terminalCollection).find().toArray();

    for (const terminal of terminals) {
      terminal.channelSets = [];
      terminal.channelSets.push(terminal.channelSet);
      delete terminal.channelSet;
      await this.connection.collection(terminalCollection).findOneAndUpdate(
        {
          _id: terminal._id,
        },
        {
          $set: terminal,
          $unset: {'channelSet': 1},
        },
      )
    }

    return null;
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return 'Update Channel Sets';
  }

  public migrationName(): string {
    return 'UpdateChannelSets';
  }

  public version(): number {
    return 1;
  }
}
