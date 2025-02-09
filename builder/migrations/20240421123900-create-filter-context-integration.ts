// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();
const integrationContextsCollection: string = 'integrationcontexts';

export class IntegrationCreateFilterContext extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await db.collection(integrationContextsCollection).insertMany([
      {
        active: true,
        cacheable: false,
        createdAt: new Date(),
        dataType: 'object',
        description: 'Clear Filters',
        inputs: [],
        integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
        method: 'products.clear.filters.context',
        title: 'Clear Filters',
        type: 'action',
        uniqueTag: 'payever.product.clear.filters.context',
        updatedAt: new Date(),
        url: '/',
        dynamicParams: [],
      },
      {
        createdAt: new Date(),
        description: 'Product Filter',
        integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
        method: 'post',
        title: 'Product Filter',
        uniqueTag: 'payever.product.filter.for.builder',
        updatedAt: new Date(),
        url: '/products',
        events: {
          invalidateCache: {},
        },
        dataType: 'object',
        fields: [
          {
            dataType: 'select',
            name: 'attributes',
            title: 'Attributes',
          },
          {
            dataType: 'select',
            name: 'categories',
            title: 'Categories',
          },
          {
            dataType: 'select',
            name: 'price',
            title: 'Price',
          },
          {
            dataType: 'select',
            name: 'type',
            title: 'Type',
          },
          {
            dataType: 'select',
            name: 'variants',
            title: 'Variants',
          },
          {
            dataType: 'select',
            name: 'brands',
            title: 'Brands',
          },
          {
            dataType: 'select',
            name: 'condition',
            title: 'Condition',
          },
        ],
        inputs: [
          {
            dataType: 'uuid',
            name: 'businessId',
            alias: 'businessId',
          },
        ],
        active: true,
        cacheable: true,
      },
    ]);
  }

  public async down(): Promise<void> {}

  public description(): string {
    return `Integration filter Context`;
  }

  public migrationName(): string {
    return `Integration filter Context`;
  }

  public version(): number {
    return 10;
  }
}
