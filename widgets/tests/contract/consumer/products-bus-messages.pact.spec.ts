import 'mocha';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { CreateProductDto, UpdateProductDto } from '../../../src/apps/products-app';
import { RemoveProductDto } from '../../../src/apps/products-app/dto/remove-product.dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessUuid: Matchers.uuid(),
      createdAt: Matchers.like('12:12:12'),
      images: eachLike(
        Matchers.like('some image'),
      ),
      price: Matchers.like(13.34),
      salePrice: Matchers.like(12.3),
      title: Matchers.like('product title'),
      uuid: Matchers.uuid(),
    },
    dtoClass: CreateProductDto,
    name: 'products.event.product.created',
  },
  {
    contentMatcher: {
      businessUuid: Matchers.uuid(),
      images: eachLike(
        Matchers.like('some image'),
      ),
      price: Matchers.like(32.32),
      salePrice: Matchers.like(12.23),
      title: Matchers.like('Some title'),
      uuid: Matchers.uuid(),
    },
    dtoClass: UpdateProductDto,
    name: 'products.event.product.updated',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      businessUuid: Matchers.uuid(),
    },
    dtoClass: RemoveProductDto,
    name: 'products.event.product.removed',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Products,
);

describe('Receive products bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
