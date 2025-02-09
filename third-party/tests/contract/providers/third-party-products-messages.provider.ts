import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { BusinessModel } from '../../../src/business/models';
import { ProductTypeEnum } from '../../../src/products/enum';
import { EventProducer } from '../../../src/products/producer';
import { IntegrationModel } from '@pe/third-party-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class ThirdPartyProductsMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider('third-party.event.product.created')
  public async productCreated(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterProductCreated(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      {
        active: true,
        barcode: 'barcode',
        categories: ['categoryName'],
        currency: 'EUR',
        description: 'description',
        images: ['image.png'],
        onSales: false,
        price: 10,
        salePrice: 20,
        shipping: {
          height: 2,
          length: 3,
          weight: 4,
          width: 1,
        },
        sku: 'sku',
        title: 'title',
        type: ProductTypeEnum.Physical,
        variants: [{
          barcode: 'variant_barcode',
          description: 'variant_description',
          images: ['variant_image.png'],
          onSales: false,
          options: [{
            name: 'OptionName',
            value: 'OptionValue',
          }],
          price: 20,
          salePrice: 30,
          sku: 'variant_sku',
          title: 'variant_title',
        }],
      },
    );
  }

  @PactRabbitMqMessageProvider('third-party.event.product.updated')
  public async productUpdated(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterProductUpdated(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      {
        active: true,
        barcode: 'barcode',
        categories: ['categoryName'],
        currency: 'EUR',
        description: 'description',
        images: ['image.png'],
        onSales: false,
        price: 10,
        salePrice: 20,
        shipping: {
          height: 2,
          length: 3,
          weight: 4,
          width: 1,
        },
        sku: 'sku',
        title: 'title',
        type: ProductTypeEnum.Physical,
        variants: [{
          barcode: 'variant_barcode',
          description: 'variant_description',
          images: ['variant_image.png'],
          onSales: false,
          options: [{
            name: 'OptionName',
            value: 'OptionValue',
          }],
          price: 20,
          salePrice: 30,
          sku: 'variant_sku',
          title: 'variant_title',
        }],
      },
    );
  }

  @PactRabbitMqMessageProvider('third-party.event.product.upserted')
  public async productUpserted(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterProductUpserted(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      {
        active: true,
        barcode: 'barcode',
        categories: ['categoryName'],
        currency: 'EUR',
        description: 'description',
        images: ['image.png'],
        onSales: false,
        price: 10,
        salePrice: 20,
        shipping: {
          height: 2,
          length: 3,
          weight: 4,
          width: 1,
        },
        sku: 'sku',
        title: 'title',
        type: ProductTypeEnum.Physical,
        variants: [{
          barcode: 'variant_barcode',
          description: 'variant_description',
          images: ['variant_image.png'],
          onSales: false,
          options: [{
            name: 'OptionName',
            value: 'OptionValue',
          }],
          price: 20,
          salePrice: 30,
          sku: 'variant_sku',
          title: 'variant_title',
        }],
      },
    );
  }

  @PactRabbitMqMessageProvider('third-party.event.product.removed')
  public async productRemoved(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterProductRemoved(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration' } as IntegrationModel,
      { sku: 'sku' },
    );
  }
}
