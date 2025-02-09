'use strict';

import { BaseMigration } from '@pe/migration-kit';

const connections: string = 'connections';

export class UpdateConnectionNamesMigration extends BaseMigration {

  public async up(): Promise<void> {

    const uuidRegexExpression: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    await this.connection.collection(connections)
      .updateMany(
        { name: uuidRegexExpression },
        { $set: { name: '' } }
      );

    return null;
  };

  public async down(): Promise<void> {
    return null;
  };

  public description(): string {
    return 'update connection names';
  };

  public migrationName(): string {
    return 'UpdateConnectionNamesMigration';
  };

  public version(): number {
    return 1;
  };
}
