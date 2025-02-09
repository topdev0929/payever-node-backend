// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import { SuggestedApps } from '../fixtures/suggested-apps';
import * as dotenv from 'dotenv';

dotenv.config();

const AppCollection: string = 'apps';

export class AddSuggestedApp extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await upsert(db, AppCollection, SuggestedApps);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Add suggested apps for search`;
  }

  public migrationName(): string {
    return `App Suggested Apps`;
  }

  public version(): number {
    return 1;
  }
}

async function upsert(db: Db, collection: string, datas: any[]): Promise<void> {
  for (let data of datas) {
    const set: any = {
      ...data,
    };

    set.createdAt = new Date();
    set.updatedAt = new Date();

    await db.collection(collection).findOneAndUpdate(
      { _id: data._id},
      {
        $set: set,
      },
      { upsert: true },
    );
  }
}
