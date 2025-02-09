import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import {
  ThirdPartyProductMessageDto,
  ThirdPartyProductRemovedMessageDto
} from '../../../../src/synchronizer/dto/third-party-rabbit-messages';
import { pactConfiguration, ProvidersEnum } from '../../config';

const messages: any[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integration_name'),
      },
      payload: {
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
    },
    dtoClass: ThirdPartyProductMessageDto,
    name: 'third-party.event.product.created',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integration_name'),
      },
      payload: {
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
    },
    dtoClass: ThirdPartyProductMessageDto,
    name: 'third-party.event.product.updated',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integration_name'),
      },
      payload: {
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
    },
    dtoClass: ThirdPartyProductMessageDto,
    name: 'third-party.event.product.upserted',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integration_name'),
      },
      payload: {
        sku: Matchers.like('sku'),
      },
    },
    dtoClass: ThirdPartyProductRemovedMessageDto,
    name: 'third-party.event.product.removed',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ThirdParty,
);

describe('Receive third party micro products message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
