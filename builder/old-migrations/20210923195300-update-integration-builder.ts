import { MongoClient } from 'mongodb';
import { contexts, integrationData, integrationLinks, integrations } from '@pe/builder-kit/module/migration-data';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const contextsCollection: string = 'contexts';
const integrationsCollection: string = 'integrations';
const integrationdatasCollection: string = 'integrationdatas';
const integrationsLinksColl: string = 'integrationlinks';

/** @deprecated: using migrate kit, also moved to 20230106172000-integration-context.ts */
export async function up(db: any): Promise<void> {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const shopDb: any = await client.db();

  await upsert(shopDb, integrationsCollection, integrations);
  await upsert(shopDb, contextsCollection, contexts);
  await upsert(shopDb, integrationsLinksColl, integrationLinks);
  await upsert(shopDb, integrationdatasCollection, integrationData);

  await client.close();

  return null;
}

async function upsert(shopDb: any, collection: string, datas: any[]): Promise<void> {
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

    let dataStr2: string = JSON.stringify(data);
    dataStr2 = dataStr2.replace(/\{builder_application_type\}/g, env.APPLICATION_TYPE);
    data = JSON.parse(dataStr2);

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
