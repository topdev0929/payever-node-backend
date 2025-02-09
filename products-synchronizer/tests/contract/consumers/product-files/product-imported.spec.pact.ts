import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import { ProductFilesRabbitMessagesEnum } from '../../../../src/synchronizer/enums';
import { ProductImportedDto } from '../../../../src/synchronizer/dto/product-files-rabbit-messages';
import { pactConfiguration, ProvidersEnum } from '../../config';

const messages: any[] = [
  {
    contentMatcher: {
      data: {
        active: Matchers.like(true),
        barcode: Matchers.like('barcode'),
        categories: Matchers.eachLike('categoryName'),
        currency: Matchers.like('EUR'),
        description: Matchers.like('description'),
        images: Matchers.eachLike('image.png'),
        onSales: Matchers.like(false),
        price: Matchers.like(10),
        salePrice: Matchers.like(20),
        shipping: {
          height: Matchers.like(2),
          length: Matchers.like(3),
          weight: Matchers.like(4),
          width: Matchers.like(1),
        },
        sku: Matchers.like('sku'),
        title: Matchers.like('title'),
        type: Matchers.like('physical'),
        variants: Matchers.eachLike({
          barcode: Matchers.like('variant_barcode'),
          description: Matchers.like('variant_description'),
          images: Matchers.eachLike('variant_image.png'),
          onSales: Matchers.like(false),
          options: Matchers.eachLike({
            name: Matchers.like('OptionName'),
            value: Matchers.like('OptionValue'),
          }),
          price: Matchers.like(20),
          salePrice: Matchers.like(30),
          sku: Matchers.like('variant_sku'),
          title: Matchers.like('variant_title'),
        }),
      },
      synchronization: {
        taskId: Matchers.uuid(),
      },
    },
    dtoClass: ProductImportedDto,
    name: ProductFilesRabbitMessagesEnum.ProductImported + ' no inventory',
  },
  {
    contentMatcher: {
      data: {
        active: Matchers.like(true),
        barcode: Matchers.like('barcode'),
        categories: Matchers.eachLike('categoryName'),
        currency: Matchers.like('EUR'),
        description: Matchers.like('description'),
        images: Matchers.eachLike('image.png'),
        inventory: {
          stock: Matchers.like(10),
        },
        onSales: Matchers.like(false),
        price: Matchers.like(10),
        salePrice: Matchers.like(20),
        shipping: {
          height: Matchers.like(2),
          length: Matchers.like(3),
          weight: Matchers.like(4),
          width: Matchers.like(1),
        },
        sku: Matchers.like('sku'),
        title: Matchers.like('title'),
        type: Matchers.like('physical'),
        variants: Matchers.eachLike({
          barcode: Matchers.like('variant_barcode'),
          description: Matchers.like('variant_description'),
          images: Matchers.eachLike('variant_image.png'),
          inventory: {
            stock: Matchers.like(20),
          },
          onSales: Matchers.like(false),
          options: Matchers.eachLike({
            name: Matchers.like('OptionName'),
            value: Matchers.like('OptionValue'),
          }),
          price: Matchers.like(20),
          salePrice: Matchers.like(30),
          sku: Matchers.like('variant_sku'),
          title: Matchers.like('variant_title'),
        }),
      },
      synchronization: {
        taskId: Matchers.uuid(),
      },

    },
    dtoClass: ProductImportedDto,
    name: ProductFilesRabbitMessagesEnum.ProductImported + ' with inventory',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ProductFiles,
);

describe('Receive product-files.event.product.imported message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
