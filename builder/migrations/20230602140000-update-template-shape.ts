// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

export class UpdateTemplateShape extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();
    const themeElementCollection: Collection = db.collection(`themeelements`);
    const shapeCollection: Collection = db.collection(`shapes`);

    let shapeString: string = fs.readFileSync(
      './migrations/data/shapes.basic.json',
      'utf-8',
    );
    const themeElementsString: string = fs.readFileSync(
      './migrations/data/themeelements.basic.json',
      'utf-8',
    );

    const themeElements: any = JSON.parse(themeElementsString);
    for (const themeElement of themeElements) {
      await upsertElement(themeElementCollection, themeElement);
    }

    const shapes: any = JSON.parse(shapeString);
    for (const shape of shapes) {
      await upsert(shapeCollection, shape);
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
