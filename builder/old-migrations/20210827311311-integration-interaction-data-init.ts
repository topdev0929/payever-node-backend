import { MongoClient } from 'mongodb';
import { integrationInteractions } from '@pe/builder-kit/module/migration-data';

const integrationsubscriptionsCollection: string = 'integrationinteractions';

/** @deprecated: using migrate kit, also moved to 20230106172000-integration-context.ts */
export async function up(db: any): Promise<void> {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const shopDb: any = await client.db();

  await upsert(shopDb, integrationsubscriptionsCollection, integrationInteractions);

  await client.close();

  return null;
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
