// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';

export class AddTemplateShape extends BaseMigration {
  public async up(): Promise<void> {
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `init`;
  }

  public migrationName(): string {
    return `init`;
  }

  public version(): number {
    return 1;
  }
}
