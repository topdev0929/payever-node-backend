// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

export class UpdateTemplateElementsStyles extends BaseMigration {
  public async up(): Promise<void> {
    const themeElements: any = JSON.parse(fs.readFileSync(
      './migrations/data/themeelements.basic.json',
      'utf-8',
    ));
    for (const themeElement of themeElements) {
      await upsertElement(this.connection.collection(`themeelements`), themeElement);
    }
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Update template element styles`;
  }

  public migrationName(): string {
    return `Update template element styles`;
  }

  public version(): number {
    return 2;
  }
}

async function upsert(collection: Collection, data: any): Promise<void> {
  const set: any = {
    ...data,
  };

  if (set.element && set.element.styles && set.element.styles.desktop) {
    set.element.styles.tablet = { ...set.element.styles.desktop };
    set.element.styles.mobile = { ...set.element.styles.desktop };
  }
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
  await upsert(collection, data);
}
