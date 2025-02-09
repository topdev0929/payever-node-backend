'use strict';
import { BaseMigration } from '@pe/migration-kit';
import { channelsFixture } from '../fixtures/channels.fixture';

const channelsCollection: string = 'channels';

export class AddChannelsMigration extends BaseMigration {

  public async up(): Promise<void> {
    for (const fixture of channelsFixture) {
      const existing: Array<{ }> = await this.connection
        .collection(channelsCollection)
        .find({ type : fixture.type})
        .toArray();

      if (!existing.length) {
        fixture.createdAt = new Date();
        fixture.updatedAt = new Date();
        await this.connection
          .collection(channelsCollection)
          .insertOne(fixture);
      }
    }
  }

  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return 'Adds marketplace channels';
  }

  public migrationName(): string {
    return 'AddChannelsMigration';
  }

  public version(): number {
    return 1;
  }
}
