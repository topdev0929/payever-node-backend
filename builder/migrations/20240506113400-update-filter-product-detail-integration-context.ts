// tslint:disable:object-literal-sort-keys
import { BaseMigration } from '@pe/migration-kit';
import { Db, MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();
const integrationContextsCollection: string = 'integrationcontexts';

export class UpdateFilterAndProductDetailContext extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    await db.collection(integrationContextsCollection).insertOne({
      active: true,
      cacheable: false,
      createdAt: new Date(),
      dataType: 'object',
      description: 'Select Variant',
      integration: 'f81d0a0e-0352-4973-b5af-76beff677882',
      method: 'context.patch',
      title: 'Select Variant',
      type: 'action',
      uniqueTag: 'payever.product.detail.update.context',
      updatedAt: new Date(),
      dynamicParams : [
        {
          field : 'uniqueTag',
          value : {
            _ : 'payever.product.detail.for.builder'
          }
        },
        {
          field : 'patch',
          value : {
            selectedVariant : 'value',
            price : 'value.price',
            priceAndCurrency : 'value.priceAndCurrency',
            salePriceAndCurrency : 'value.salePriceAndCurrency',
            imageUrl: 'value.imageUrl'
          }
        }
      ]
    });

    await db.collection(integrationContextsCollection).updateOne(
      { uniqueTag: 'payever.product.detail.for.builder' },
      {
        $set: {
          fields: [
            {
              dataType: 'uuid',
              name: 'id',
              title: 'ID'
            },
            {
              dataType: 'string',
              name: 'slug',
              title: 'Slug'
            },
            {
              dataType: 'string',
              name: 'title',
              title: 'Title'
            },
            {
              dataType: 'image-url',
              name: 'imageUrl',
              title: 'Image Url'
            },
            {
              dataType: 'string',
              name: 'currency',
              title: 'Currency'
            },
            {
              dataType: 'string',
              name: 'priceAndCurrency',
              title: 'Price and Currency'
            },
            {
              dataType: 'number',
              name: 'price',
              title: 'Price'
            },
            {
              dataType: 'string',
              name: 'salePriceAndCurrency',
              title: 'Sale Price and Currency'
            },
            {
              dataType: 'number',
              name: 'sale',
              title: 'Sale'
            },
            {
              dataType: 'number',
              name: 'stock',
              title: 'Stock'
            },
            {
              dataType: 'string',
              name: 'description',
              title: 'Description'
            },
            {
              dataType: 'string',
              name: 'sku',
              title: 'sku'
            },
            {
              dataType: 'string',
              name: 'barcode',
              title: 'barcode'
            },
            {
              dataType: 'document',
              name: 'shipping',
              title: 'Shipping',
              fields: [
                {
                  dataType: 'string',
                  name: 'measure_mass',
                  title: 'Measure mass'
                },
                {
                  dataType: 'string',
                  name: 'measure_size',
                  title: 'Measure size'
                },
                {
                  dataType: 'number',
                  name: 'weight',
                  title: 'Weight'
                },
                {
                  dataType: 'number',
                  name: 'width',
                  title: 'Width'
                },
                {
                  dataType: 'number',
                  name: 'length',
                  title: 'Length'
                },
                {
                  dataType: 'number',
                  name: 'height',
                  title: 'Height'
                }
              ]
            },
            {
              dataType: 'document',
              name: 'selectedVariant',
              title: 'Selected Variant',
              fields: [
                {
                  dataType: 'string',
                  name: 'id',
                  title: 'ID'
                },
                {
                  dataType: 'string',
                  name: 'sku',
                  title: 'SKU'
                },
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                },
                {
                  dataType: 'number',
                  name: 'price',
                  title: 'Price'
                },
                {
                  dataType: 'number',
                  name: 'sale',
                  title: 'Sale'
                },
                {
                  dataType: 'string',
                  name: 'salePriceAndCurrency',
                  title: 'Sale Price and Currency'
                },
                {
                  dataType: 'string',
                  name: 'priceAndCurrency',
                  title: 'Price and Currency'
                },
                {
                  dataType: 'string',
                  name: 'description',
                  title: 'Description'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'variants',
              title: 'Variants',
              fields: [
                {
                  dataType: 'string',
                  name: 'id',
                  title: 'ID'
                },
                {
                  dataType: 'string',
                  name: 'sku',
                  title: 'SKU'
                },
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                },
                {
                  dataType: 'number',
                  name: 'price',
                  title: 'Price'
                },
                {
                  dataType: 'number',
                  name: 'sale',
                  title: 'Sale'
                },
                {
                  dataType: 'string',
                  name: 'salePriceAndCurrency',
                  title: 'Sale Price and Currency'
                },
                {
                  dataType: 'string',
                  name: 'priceAndCurrency',
                  title: 'Price and Currency'
                },
                {
                  dataType: 'string',
                  name: 'description',
                  title: 'Description'
                },
                {
                  dataType: 'image-url',
                  name: 'imageUrl',
                  title: 'Image Url'
                }
              ]
            }
          ]
        }
      }
    )

    await db.collection(integrationContextsCollection).updateOne(
      { uniqueTag: 'payever.product.filter.for.builder' },
      {
        $set: {
          fields: [
            {
              dataType: 'array',
              name: 'attributes',
              title: 'Attributes',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'categories',
              title: 'Categories',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'price',
              title: 'Price',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'type',
              title: 'Type',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'variants',
              title: 'Variants',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'brands',
              title: 'Brands',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            },
            {
              dataType: 'array',
              name: 'condition',
              title: 'Condition',
              fields: [
                {
                  dataType: 'string',
                  name: 'title',
                  title: 'Title'
                }
              ]
            }
          ],
        }
      });
  }

  public async down(): Promise<void> { }

  public description(): string {
    return `Update Filter And Product Detail Context`;
  }

  public migrationName(): string {
    return `Update Filter And Product Detail Context`;
  }

  public version(): number {
    return 10;
  }
}
