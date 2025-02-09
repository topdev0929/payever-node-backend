import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { ProductsEventsProducer } from '../../../src/products/producers';
import { ProductModel } from '../../../src/products/models';
import * as uuid from 'uuid';

@Injectable()
export class ProductsMessagesMock extends AbstractMessageMock {

  private productStub: any =
    {
      toObject: (): any => {
        return {
          _id: uuid.v4(),
          businessId: uuid.v4(),
          createdAt: '2019-12-10T14:33:27.876Z',
          description: 'some desc',
          images: ['image1'],
          imagesUrl: ['http://image1'],
          price: 1,
          salePrice: 12.2,
          sku: 'test_sku1',
          title: 'some title',
          uuid: uuid.v4(),
          categories: [
            {
              _id: uuid.v4(),
              businessId: uuid.v4(),
              slug: 'iloveorange',
              title: 'iloveorange',
            }
          ]
        };
      },
    } as any;

  @PactRabbitMqMessageProvider('products.event.product.sku-updated')
  public async mockSkuUpdated(): Promise<void> {
    const producer: ProductsEventsProducer = await this.getProvider<ProductsEventsProducer>(ProductsEventsProducer);
    await producer.skuUpdated(
      {
        businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        sku: 'test_sku1',
      } as ProductModel,
      {
        businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        sku: 'test_sku2',
      } as ProductModel,
    );
  }

  @PactRabbitMqMessageProvider('products.event.product.sku-removed')
  public async mockSkuRemoved(): Promise<void> {
    const producer: ProductsEventsProducer = await this.getProvider<ProductsEventsProducer>(ProductsEventsProducer);
    await producer.skuRemoved(
      {
        businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        sku: 'test_sku',
      } as ProductModel,
    );
  }

  @PactRabbitMqMessageProvider('products.event.product.created')
  public async mockProductCreated(): Promise<void> {
    const producer: ProductsEventsProducer = await this.getProvider<ProductsEventsProducer>(ProductsEventsProducer);
    await producer.productCreated(this.productStub);
  }

  @PactRabbitMqMessageProvider('products.event.product.updated')
  public async mockProductUpdated(): Promise<void> {
    const producer: ProductsEventsProducer = await this.getProvider<ProductsEventsProducer>(ProductsEventsProducer);
    await producer.productUpdated(this.productStub, this.productStub);
  }

  @PactRabbitMqMessageProvider('products.event.product.removed')
  public async mockProductRemoved(): Promise<void> {
    const producer: ProductsEventsProducer = await this.getProvider<ProductsEventsProducer>(ProductsEventsProducer);
    await producer.productRemoved(this.productStub);
  }

  @PactRabbitMqMessageProvider('products.event.product.exported')
  public async mockProductExported(): Promise<void> {
    const producer: ProductsEventsProducer = await this.getProvider<ProductsEventsProducer>(ProductsEventsProducer);
    await producer.productExported(this.productStub);
  }
}
