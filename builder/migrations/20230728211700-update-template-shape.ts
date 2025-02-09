// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

export class UpdateTemplateShape extends BaseMigration {
  public async up(): Promise<void> {
    const themeElements: any = JSON.parse(fs.readFileSync(
      './migrations/data/themeelements.basic.json',
      'utf-8',
    ));
    for (const themeElement of themeElements) {
      await upsertElement(this.connection.collection(`themeelements`), themeElement);
    }

    const shapes: any = JSON.parse(fs.readFileSync(
      './migrations/data/shapes.basic.json',
      'utf-8',
    ));
    for (const shape of shapes) {
      await upsert(this.connection.collection(`shapes`), shape);
    }
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Update template shape`;
  }

  public migrationName(): string {
    return `Update template shape`;
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
