import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;
import { contexts, IntegrationUniqueTag } from '@pe/builder-kit/module/migration-data';

dotenv.config();
const env: ProcessEnv = process.env;
const contextsCollection: string = 'contexts';
const integrationActionCollection: string = 'integrationactions';
const integrationInteractionsCollection: string = 'integrationinteractions';
const integrationDataCollection: string = 'integrationdatas';

/** @deprecated: using migrate kit, also moved to 20230106172000-integration-context.ts */
export async function up(db: any): Promise<void> {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const shopDb: any = await client.db();

  await updateUnique(shopDb, contextsCollection, IntegrationUniqueTag.contextAndAction);
  await updateUnique(shopDb, integrationActionCollection, IntegrationUniqueTag.contextAndAction);
  await updateUniqueById(shopDb, integrationInteractionsCollection, IntegrationUniqueTag.interaction);
  await updateUniqueById(shopDb, contextsCollection, IntegrationUniqueTag.context);
  await updateUniqueById(shopDb, integrationDataCollection, IntegrationUniqueTag.data);

  await upsert(shopDb, contextsCollection, contexts);

  await client.close();

  return null;
}

async function updateUnique(shopDb: any, collection: string, datas: any[]): Promise<void> {
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

    await shopDb.collection(collection).findOneAndUpdate(
      {
        integration: data.integration,
        method: data.method,
        url: data.url,
      },
      {
        $set: {
          uniqueTag: data.uniqueTag,
        },
      },
    );
  }
}

async function updateUniqueById(shopDb: any, collection: string, datas: any[]): Promise<void> {
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

    await shopDb.collection(collection).findOneAndUpdate(
      {
        _id: data._id,
      },
      {
        $set: {
          uniqueTag: data.uniqueTag,
        },
      },
    );
  }
}

async function upsert(shopDb: any, collection: string, datas: any[]): Promise<void> {
  for (const data of datas) {
    const set: any = {
      ...data,
    };

    set.createdAt = new Date(set.createdAt.$date);
    set.updatedAt = new Date(set.updatedAt.$date);
    delete set._id;

    await shopDb.collection(collection).findOneAndUpdate(
      { _id: data._id},
      {
        $set: set,
      },
      { upsert: true },
    );
  }
}
