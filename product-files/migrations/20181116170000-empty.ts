'use strict';
import { BaseMigration } from '@pe/migration-kit';

export class EmptyMigration extends BaseMigration {

  public async up(): Promise<void> {
    return;
  };

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return 'empty migration';
  };

  public migrationName(): string {
    return 'EmptyMigration';
  };

  public version(): number {
    return 1;
  };
}