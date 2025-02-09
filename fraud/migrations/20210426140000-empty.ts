import { BaseMigration } from '@pe/migration-kit';

export class EmptyMigration extends BaseMigration {
  public async up(): Promise<void> {
  }
  
  public async down(): Promise<void> {
    return null;
  }
  
  public description(): string {
    return 'Empty migration';
  }
  
  public migrationName(): string {
    return 'EmptyMigration';
  }
  
  public version(): number {
    return 1;
  }
}
