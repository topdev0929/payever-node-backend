// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';

export class AddTemplateShape extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await db.collection(`folders`).update(
      {
        createdBy: 'admin',
        name: 'Payever Themes',
      },
      {
        $set: {
          name: 'payever Themes',
        },
      },
      null,
      null,
    );
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Add template shape`;
  }

  public migrationName(): string {
    return `Add template shape`;
  }

  public version(): number {
    return 1;
  }
}
