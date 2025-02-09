// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

export class UpdateTemplate extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();
    const themeElementCollection: Collection = db.collection(`themeelements`);

    const themeElementsString: string = fs.readFileSync(
      './migrations/data/themeelements.basic.json',
      'utf-8',
    );

    const themeElements: any = JSON.parse(themeElementsString);
    for (const themeElement of themeElements) {
      await upsertElement(themeElementCollection, themeElement);
    }
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Update template shape v2`;
  }

  public migrationName(): string {
    return `Update template shape v2`;
  }

  public version(): number {
    return 2;
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

async function upsertElement(collection: Collection, data: any): Promise<void> {
  await collection.remove(
    {
      page: data.page,
      elementId: data.elementId,
      shape: data.shape,
    },
    null,
    null,
  );

  await upsert(collection, data);
}
