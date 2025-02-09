'use strict';

import { BaseMigration } from '@pe/migration-kit';

export class EmptyMigration extends BaseMigration {

  public async up(): Promise<void> {}

  public async down(): Promise<void> {};

  public description(): string {
    return 'empty migration'
  };

  public migrationName(): string {
    return 'empty migration'
  }

  public version(): number {
    return 2
  }
}
