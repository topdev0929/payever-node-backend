// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();
const integrationContextsCollection: string = 'integrationcontexts';

export class IntegrationProductUpdateContext extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await db.collection(integrationContextsCollection).insertOne({
      active: true,
      cacheable: false,
      createdAt: new Date(),
      dataType: 'object',
      description: 'Update Detail',
      inputs: [],
      integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
      method: 'products.update.detail.context',
      title: 'Update Detail',
      type: 'action',
      uniqueTag: 'payever.product.update.detail.context',
      updatedAt: new Date(),
      url: '/',
      dynamicParams: [
        {
          field: 'value',
          value: 'context.value.value',
        },
        {
          field : 'price',
          value : 'context.value.value.price'
        }
      ],
    });
  }

  public async down(): Promise<void> {}

  public description(): string {
    return `Integration product update Context`;
  }

  public migrationName(): string {
    return `Integration product update Context`;
  }

  public version(): number {
    return 10;
  }
}
