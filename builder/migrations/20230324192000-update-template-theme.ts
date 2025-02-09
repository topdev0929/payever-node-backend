// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

export class updateTemplateTheme extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();
    const themeCollection: Collection = db.collection(`themes`);

    let themeString: string = fs.readFileSync(
      './migrations/data/default-theme/themes.json',
      'utf-8',
    );

    const themes: any = JSON.parse(themeString);
    for (const theme of themes) {
      await upsert(themeCollection, theme);
    }
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Update template theme`;
  }

  public migrationName(): string {
    return `Update template theme`;
  }

  public version(): number {
    return 1;
  }
}

async function upsert(collection: Collection, data: any): Promise<void> {
  const set: any = {
    ...data,
  };

  set.createdAt = new Date();
  set.updatedAt = new Date();
  delete set._id;

  await collection.findOneAndUpdate(
    { _id: data._id },
    {
      $set: set,
    },
    { upsert: true },
  );
}
