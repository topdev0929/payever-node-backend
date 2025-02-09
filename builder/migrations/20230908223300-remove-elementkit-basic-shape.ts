// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Collection } from 'mongodb';
import * as fs from 'fs';

export class RemoveElementKitBasicShape extends BaseMigration {
  public async up(): Promise<void> {
    const shapes: any = JSON.parse(fs.readFileSync(
      './migrations/data/shapes.basic.json',
      'utf-8',
    ));
    for (const shape of shapes) {
      await unset(this.connection.collection(`shapes`), shape);
    }
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Remove elementKit form basic shape`;
  }

  public migrationName(): string {
    return `Remove elementKit form basic shape`;
  }

  public version(): number {
    return 1;
  }
}

async function unset(collection: Collection, data: any): Promise<void> {
  const set: any = {
    ...data,
  };

  set.createdAt = new Date();
  set.updatedAt = new Date();
  delete set._id;

  const unset: any = {
    elementKit: '',
  }

  await collection.findOneAndUpdate(
    { _id: data._id },
    {
      $set: set,
      $unset: unset,
    },
    { upsert: true },
  );
}
