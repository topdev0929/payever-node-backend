import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { ImportEventsService } from '../../../src/file-imports/service';
import { ProductTypeEnum } from '../../../src/file-imports/dto/products';
import { ProductImportedEventName } from '../../../src/file-imports/interfaces';

export class ProductImportedProvider extends AbstractMessageMock{
  @PactRabbitMqMessageProvider(`${ProductImportedEventName} no inventory`)
  public async mockProductImportedNoInventory(): Promise<void> {
    const producer: ImportEventsService = await this.getProvider<ImportEventsService>(ImportEventsService);
    await producer.sendProductImportedEvent({
      business: {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      },
      synchronization: {
        taskId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      },
      errors: [
        {
          sku: 'test_sku',
          messages: ['Some error message', 'Another error messages'],
        },
      ],
      data: {
        active: false,
        barcode: 'test_barcode',
        categories: ['categoryName'],
        currency: 'EUR',
        description: 'test description',
        images: ['image1.png', 'image2.png'],
        onSales: false,
        price: 10,
        salePrice: 20,
        shipping: {
          height: 2,
          length: 3,
          weight: 4,
          width: 1,
        },
        sku: 'test_sku',
        title: 'some title',
        type: ProductTypeEnum.digital,
        variants: [
          {
            barcode: 'variant_barcode',
            description: 'variant_description',
            images: ['variant_image.png'],
            onSales: true,
            attributes: [
              {
                type: '',
                name: 'Option1Name',
                value: 'Option1Value',
              },
            ],
            price: 20,
            salePrice: 30,
            sku: 'variant_sku',
            title: 'variant_title',
          },
        ],
      },
    });
  }

  @PactRabbitMqMessageProvider(`${ProductImportedEventName} with inventory`)
  public async mockProductImportedWithInventory(): Promise<void> {
    const producer: ImportEventsService = await this.getProvider<ImportEventsService>(ImportEventsService);
    await producer.sendProductImportedEvent({
      business: {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      },
      synchronization: {
        taskId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      },
      errors: [
        {
          sku: 'test_sku',
          messages: ['Some error message', 'Another error messages'],
        },
      ],
      data: {
        active: false,
        barcode: 'test_barcode',
        categories: ['categoryName'],
        currency: 'EUR',
        description: 'test description',
        images: ['image1.png', 'image2.png'],
        onSales: false,
        price: 10,
        salePrice: 20,
        shipping: {
          height: 2,
          length: 3,
          weight: 4,
          width: 1,
        },
        sku: 'test_sku',
        title: 'some title',
        type: ProductTypeEnum.digital,
        inventory: {
          stock: 10,
        },
        variants: [
          {
            barcode: 'variant_barcode',
            description: 'variant_description',
            images: ['variant_image.png'],
            onSales: true,
            inventory: {
              stock: 10,
            },
            attributes: [
              {
                type: '',
                name: 'Option1Name',
                value: 'Option1Value',
              },
            ],
            price: 20,
            salePrice: 30,
            sku: 'variant_sku',
            title: 'variant_title',
          },
        ],
      },
    });
  }
}
