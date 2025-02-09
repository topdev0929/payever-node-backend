import { MongoClient } from 'mongodb';
import { contexts, integrationInteractions, IntegrationUniqueTag } from '@pe/builder-kit/module/migration-data';

import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();

const env: ProcessEnv = process.env;

/** @deprecated: using migrate kit, also moved to 20230106172000-integration-context.ts */
export async function up(db: any): Promise<void> {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const shopDb: any = await client.db();

  await upsert(shopDb, `integrationinteractions`, integrationInteractions);

  await shopDb.collection(`integrationactions`).findOneAndUpdate(
    {
      _id :
        {
          $in : [
            '003b9d1a-4be0-46df-aad1-b74aca1b4373',
            '0742fa6b-3cc0-437d-92f2-ac534559e423',
            '3ea88da4-54dd-41e5-a3bb-0481222a126c',
            '15cffe43-4dc3-49e5-b237-3f128c4620b2',
          ],
        } ,
    },
    {
      $set: {
        params: [
          {
            identifier: {
              type: 'string',
            },
          },
        ],
      },
    },
  );

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

