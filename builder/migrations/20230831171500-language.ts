// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import { language, } from '@pe/builder-kit/module/migration-data';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const languageCollection: string = 'languages';


export class Language extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await upsert(db, languageCollection, language);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Language`;
  }

  public migrationName(): string {
    return `Language`;
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
