import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import 'mocha';
import {
  ProductSkuRemovedDto,
  ProductSkuUpdatedDto,
} from '../../../src/inventory/dto';
import { RabbitEventsEnum } from '../../../src/inventory/enums';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      originalSku: Matchers.like('original_sku'),
      updatedSku: Matchers.like('updated_sku'),
    },
    dtoClass: ProductSkuUpdatedDto,
    name: RabbitEventsEnum.SkuUpdated,
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      sku: Matchers.like('test_sku'),
    },
    dtoClass: ProductSkuRemovedDto,
    name: RabbitEventsEnum.SkuRemoved,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Products
);

describe('Receive products bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
