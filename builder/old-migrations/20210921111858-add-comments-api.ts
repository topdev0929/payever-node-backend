import { MongoClient } from 'mongodb';
import {
  contexts,
  integrationData,
  integrationLinks,
} from '@pe/builder-kit/module/migration-data';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const applications: string[] = [
  'blog',
];

const contextsCollection: string = 'contexts';
const integrationsLinksCollection: string = 'integrationlinks';
const integrationdatasCollection: string = 'integrationdatas';

/** @deprecated: using migrate kit, also moved to 20230106172000-integration-context.ts */
export async function up(db: any): Promise<void> {
  if (!applications.includes(env.APPLICATION_TYPE)) {
    return null;
  }

  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const subscriptionDb: any = await client.db();

  await upsert(subscriptionDb, contextsCollection, contexts);
  await upsert(subscriptionDb, integrationsLinksCollection, integrationLinks);
  await upsert(subscriptionDb, integrationdatasCollection, integrationData);

  await client.close();
}

async function upsert(subscriptionDb: any, collection: string, datas: any[]): Promise<void> {
  for (const data of datas) {
    const set: any = {
      ...data,
    };

    set.createdAt = new Date(set.createdAt.$date);
    set.updatedAt = new Date(set.updatedAt.$date);
    delete set._id;

    await subscriptionDb.collection(collection).findOneAndUpdate(
      { _id: data._id},
      {
        $set: set,
      },
      { upsert: true },
    );
  }
}
