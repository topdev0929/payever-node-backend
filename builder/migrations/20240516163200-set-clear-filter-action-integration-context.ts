// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();
const integrationContextsCollection: string = 'integrationcontexts';

export class SetAndClearFilterActionForProductIntegration extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();
    await db.collection(integrationContextsCollection).insertMany(
      [
        {
          active: true,
          cacheable: false,
          method: 'context.data-source.set-filter',
          title: 'Set Filter',
          dataType: 'object',
          uniqueTag: 'payever.product.actions.set.filter',
          integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
          createdAt: new Date(),
          updatedAt: new Date(),
          description: 'Set Filter',
          type: 'action',
          dynamicParams: [
            {
              field: 'uniqueTag',
              value: {
                _: 'payever.product.list.for.builder'
              }
            },
            {
              field: 'filter',
              value: 'value.value'
            },
            {
              field: 'title',
              value: 'value.title'
            }
          ]
        },
        {
          active: true,
          cacheable: false,
          method: 'context.data-source.clear-filters',
          title: 'Clear Filters',
          dataType: 'object',
          uniqueTag: 'payever.product.actions.clear.filters',
          integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
          createdAt: new Date(),
          updatedAt: new Date(),
          description: 'Clear Filters',
          type: 'action',
          dynamicParams: [
            {
              field: 'uniqueTag',
              value: {
                _: 'payever.product.list.for.builder'
              }
            }
          ]
        }
      ]
    );
    await db.collection(integrationContextsCollection).updateOne(
      {
        integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
        uniqueTag: 'payever.product.clear.filters.context'
      },
      {
        $set:{
          active: false
        }
      }
    );
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Set And Clear Filter Action For Product Integration`;
  }

  public migrationName(): string {
    return `SetAndClearFilterActionForProductIntegration`;
  }

  public version(): number {
    return 10;
  }
}
