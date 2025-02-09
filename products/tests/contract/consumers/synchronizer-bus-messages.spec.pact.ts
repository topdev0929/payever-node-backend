import 'reflect-metadata';
import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, PePact } from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import {
  ImportProductMessageDto,
  RemoveProductMessageDto,
  SynchronizeProductMessageDto,
} from '../../../src/products/dto/synchronizer-rabbit';

const testTitle: string = 'Test title';
const testDescription: string = 'Test description';
const testImage: string = 'http://image.png';

const messages: any[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        active: Matchers.like(false),
        categories: Matchers.eachLike('categoryName'),
        description: Matchers.like(testDescription),
        images: Matchers.eachLike(testImage),
        origin: Matchers.like(`any`),
        price: Matchers.like(10),
        sku: Matchers.like('test_sku'),
        title: Matchers.like(testTitle),
      },
    },
    dtoClass: ImportProductMessageDto,
    name: 'synchronizer.event.outer-product.created minimal message',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        active: Matchers.like(false),
        barcode: Matchers.like('test barcode'),
        categories: Matchers.eachLike('categoryName'),
        country: Matchers.like('DE'),
        currency: Matchers.like('EUR'),
        description: Matchers.like(testDescription),
        images: Matchers.eachLike(testImage),
        onSales: Matchers.like(true),
        origin: Matchers.like(`any`),
        price: Matchers.like(10),
        salePrice: Matchers.like(15),
        shipping: {
          free: Matchers.like(true),
          general: Matchers.like(false),
          height: Matchers.like(13),
          length: Matchers.like(12),
          weight: Matchers.like(10),
          width: Matchers.like(11),
        },
        sku: Matchers.like('test_sku'),
        title: Matchers.like(testTitle),
        type: Matchers.like('physical'),
        variants: Matchers.eachLike({
          barcode: Matchers.like('barcode'),
          description: Matchers.like('Description'),
          images: Matchers.eachLike('image.jpg'),
          onSales: Matchers.like(true),
          options: Matchers.eachLike({
            name: 'optionName',
            value: 'optionValue',
          }),
          price: Matchers.like(10),
          salePrice: Matchers.like(12),
          sku: Matchers.like('test_sku'),
          title: Matchers.like('Title'),
        }),
        vatRate: Matchers.like(12),
      },
      synchronizationTask: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: ImportProductMessageDto,
    name: 'synchronizer.event.outer-product.created full message',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        active: Matchers.like(false),
        categories: Matchers.eachLike('categoryName'),
        description: Matchers.like(testDescription),
        images: Matchers.eachLike(testImage),
        origin: Matchers.like(`any`),
        price: Matchers.like(10),
        sku: Matchers.like('test_sku'),
        title: Matchers.like(testTitle),
      },
    },
    dtoClass: ImportProductMessageDto,
    name: 'synchronizer.event.outer-product.updated minimal message',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        active: Matchers.like(false),
        barcode: Matchers.like('test barcode'),
        categories: Matchers.eachLike('categoryName'),
        country: Matchers.like('DE'),
        currency: Matchers.like('EUR'),
        description: Matchers.like(testDescription),
        images: Matchers.eachLike(testImage),
        onSales: Matchers.like(true),
        origin: Matchers.like(`any`),
        price: Matchers.like(10),
        salePrice: Matchers.like(15),
        shipping: {
          free: Matchers.like(true),
          general: Matchers.like(false),
          height: Matchers.like(13),
          length: Matchers.like(12),
          weight: Matchers.like(10),
          width: Matchers.like(11),
        },
        sku: Matchers.like('test_sku'),
        title: Matchers.like(testTitle),
        type: Matchers.like('physical'),
        variants: Matchers.eachLike({
          barcode: Matchers.like('barcode'),
          description: Matchers.like('Description'),
          images: Matchers.eachLike('image.jpg'),
          onSales: Matchers.like(true),
          options: Matchers.eachLike({
            name: 'optionName',
            value: 'optionValue',
          }),
          price: Matchers.like(10),
          salePrice: Matchers.like(12),
          sku: Matchers.like('test_sku'),
          title: Matchers.like('Title'),
        }),
        vatRate: Matchers.like(12),
      },
      synchronizationTask: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: ImportProductMessageDto,
    name: 'synchronizer.event.outer-product.updated full message',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        active: Matchers.like(false),
        categories: Matchers.eachLike('categoryName'),
        description: Matchers.like(testDescription),
        images: Matchers.eachLike(testImage),
        origin: Matchers.like(`any`),
        price: Matchers.like(10),
        sku: Matchers.like('test_sku'),
        title: Matchers.like(testTitle),
      },
    },
    dtoClass: ImportProductMessageDto,
    name: 'synchronizer.event.outer-product.upserted minimal message',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        active: Matchers.like(false),
        barcode: Matchers.like('test barcode'),
        categories: Matchers.eachLike('categoryName'),
        country: Matchers.like('DE'),
        currency: Matchers.like('EUR'),
        description: Matchers.like(testDescription),
        images: Matchers.eachLike(testImage),
        onSales: Matchers.like(true),
        origin: Matchers.like(`any`),
        price: Matchers.like(10),
        salePrice: Matchers.like(15),
        shipping: {
          free: Matchers.like(true),
          general: Matchers.like(false),
          height: Matchers.like(13),
          length: Matchers.like(12),
          weight: Matchers.like(10),
          width: Matchers.like(11),
        },
        sku: Matchers.like('test_sku'),
        title: Matchers.like(testTitle),
        type: Matchers.like('physical'),
        variants: Matchers.eachLike({
          barcode: Matchers.like('barcode'),
          description: Matchers.like('Description'),
          images: Matchers.eachLike('image.jpg'),
          onSales: Matchers.like(true),
          options: Matchers.eachLike({
            name: 'optionName',
            value: 'optionValue',
          }),
          price: Matchers.like(10),
          salePrice: Matchers.like(12),
          sku: Matchers.like('test_sku'),
          title: Matchers.like('Title'),
        }),
        vatRate: Matchers.like(12),
      },
      synchronizationTask: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: ImportProductMessageDto,
    name: 'synchronizer.event.outer-product.upserted full message',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      payload: {
        sku: Matchers.like('test_sku'),
      },
    },
    dtoClass: RemoveProductMessageDto,
    name: 'synchronizer.event.outer-product.removed',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      synchronization: {
        taskId: Matchers.uuid(),
      }
    },
    dtoClass: SynchronizeProductMessageDto,
    name: 'synchronizer.event.products.synchronize',
  },
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Synchronizer);

describe('Receive synchronizer micro message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
