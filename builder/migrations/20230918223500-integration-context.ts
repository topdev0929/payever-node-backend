// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import { integrationv2 } from "@pe/builder-kit/module/migration-data/integration-v2";
import {
  integrationContexts,
} from "@pe/builder-kit/module/migration-data";
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const integrationv2Collection: string = 'integrationv2';
const integrationContextsCollection: string = 'integrationcontexts';


export class IntegrationContext extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await upsert(db, integrationv2Collection, integrationv2);
    await upsert(db, integrationContextsCollection, integrationContexts);
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Integration Context`;
  }

  public migrationName(): string {
    return `Integration Context`;
  }

  public version(): number {
    return 10;
  }
}

async function upsert(db: Db, collection: string, datas: any[]): Promise<void> {
  for (let data of datas) {
    if (env.APP_NAMESPACE === 'test') {
      let dataStr: string = JSON.stringify(data);
      dataStr = dataStr.replace(/\.payever\.org/g, '.test.devpayever.com');
      data = JSON.parse(dataStr);
    } else if (env.APP_NAMESPACE === 'staging') {
      let dataStr: string = JSON.stringify(data);
      dataStr = dataStr.replace(/\.payever\.org/g, '.staging.devpayever.com');
      data = JSON.parse(dataStr);
    }

    const unset: any = {
      params: 1,
      query: 1,
      responseType: 1,
      responseMeta: 1,
      tags: 1,
    };

    const set: any = {
      ...data,
    };

    set.createdAt = new Date(set?.createdAt?.$date ? set.createdAt.$date : null);
    set.updatedAt = new Date(set?.updatedAt?.$date ? set.updatedAt.$date : null);
    delete set._id;
    delete set.inputsContinue;
    delete set.fieldsContinue;

    if (data.active) {
      console.log(data);
    }

    await db.collection(collection).findOneAndUpdate(
      { _id: data._id},
      {
        $set: set,
        $unset: unset,
      },
      { upsert: true },
    );
  }
}
