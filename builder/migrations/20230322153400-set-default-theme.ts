// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

export class SetDefaultTheme extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();
    const themes: Collection = db.collection('themes');

    await themes.findOneAndUpdate(
      { type : 'template', isDefault: true },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    await setData(db, 'themes', upsert);
    await setData(db, 'themesnapshots', upsert);
    await setData(db, 'themepages', upsert);
    await setData(db, 'themeelements', upsertElement);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Set default theme`;
  }

  public migrationName(): string {
    return `Set default theme`;
  }

  public version(): number {
    return 1;
  }
}

async function setData(DB: Db, collection: string, callback: any): Promise<void> {
  const str: string = fs.readFileSync(
    `./migrations/data/default-theme/${collection}.json`,
    'utf-8',
  );
  const data: any = JSON.parse(str);
  for (const subData of data) {
    await callback(DB, collection, subData);
  }
}

async function upsert(DB: Db, collection: string, data: any): Promise<void> {
  const set: any = {
    ...data,
  };

  set.createdAt = new Date();
  set.updatedAt = new Date();
  delete set._id;

  await DB.collection(collection).findOneAndUpdate(
    { _id: data._id },
    {
      $set: set,
    },
    { upsert: true },
  );
}

async function upsertElement(DB: Db, collection: string, data: any): Promise<void> {
  const set: any = {
    ...data,
  };

  set.createdAt = new Date();
  set.updatedAt = new Date();
  delete set._id;

  await DB.collection(collection).findOneAndUpdate(
    {
      page: data.page,
      elementId: data.elementId,
      shape: data.shape,
    },
    {
      $set: set,
    },
    { upsert: true },
  );
}
