'use strict';
import { BaseMigration } from '@pe/migration-kit';

import { pluginsFixture } from '../fixtures/plugins.fixture';


export class UpdatePluginsMigration extends BaseMigration {

  public async up(): Promise<void> {
    const pluginsCollection = 'plugins';
    for (const fixture of pluginsFixture) {
      const existing: any = await this.connection.collection(pluginsCollection).findOne({ channel: fixture.channel });
      if (!existing) {
        await this.connection.collection(pluginsCollection).insertOne(fixture);
      }
    }

    return;

  }

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'update plugins migration';
  };

  public migrationName(): string {
    return 'UpdatePluginsMigration';
  };

  public version(): number {
    return 1;
  };

}
