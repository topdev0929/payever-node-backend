// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import { integrationv2 } from "@pe/builder-kit/module/migration-data/integration-v2";
import {
  components,
  contexts,
  integrationContexts,
  integrationData,
  integrationInteractions, integrationLinks, integrations, integrationSubscriptions,
  IntegrationUniqueTag,
} from "@pe/builder-kit/module/migration-data";
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const contextsCollection: string = 'contexts';
const integrationv2Collection: string = 'integrationv2';
const integrationContextsCollection: string = 'integrationcontexts';
const integrationActionCollection: string = 'integrationactions';
const integrationInteractionsCollection: string = 'integrationinteractions';
const integrationDataCollection: string = 'integrationdatas';
const integrationsCollection: string = 'integrations';
const integrationsLinksColl: string = 'integrationlinks';
const componentsCollection: string = 'components';
const integrationsubscriptionsCollection: string = 'integrationsubscriptions';


export class IntegrationContext extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await upsert(db, integrationsCollection, integrations);
    await upsert(db, componentsCollection, components);
    await upsert(db, integrationsubscriptionsCollection, integrationSubscriptions);
    await upsert(db, contextsCollection, contexts);

    await upsert(db, integrationDataCollection, integrationData);
    await upsert(db, integrationsubscriptionsCollection, integrationInteractions);
    await upsert(db, integrationsLinksColl, integrationLinks);

    await updateUnique(db, contextsCollection, IntegrationUniqueTag.contextAndAction);
    await updateUnique(db, integrationActionCollection, IntegrationUniqueTag.contextAndAction);
    await updateUniqueById(db, integrationInteractionsCollection, IntegrationUniqueTag.interaction);
    await updateUniqueById(db, contextsCollection, IntegrationUniqueTag.context);
    await updateUniqueById(db, integrationDataCollection, IntegrationUniqueTag.data);

    await upsert(db, integrationInteractionsCollection, integrationInteractions);
    await db.collection(integrationActionCollection).findOneAndUpdate(
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

    await updateUnique(db, contextsCollection, IntegrationUniqueTag.contextAndAction);
    await updateUniqueById(db, contextsCollection, IntegrationUniqueTag.context);

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
    return 1;
  }
}

async function updateUnique(db: Db, collection: string, datas: any[]): Promise<void> {
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

    await db.collection(collection).findOneAndUpdate(
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

async function updateUniqueById(db: Db, collection: string, datas: any[]): Promise<void> {
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

    await db.collection(collection).findOneAndUpdate(
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

    const set: any = {
      ...data,
    };

    set.createdAt = new Date(set?.createdAt?.$date ? set.createdAt.$date : null);
    set.updatedAt = new Date(set?.updatedAt?.$date ? set.updatedAt.$date : null);
    delete set._id;

    await db.collection(collection).findOneAndUpdate(
      { _id: data._id},
      {
        $set: set,
      },
      { upsert: true },
    );
  }
}
