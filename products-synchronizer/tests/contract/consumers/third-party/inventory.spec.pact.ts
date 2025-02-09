import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import {
  ThirdPartyStockChangedMessageDto,
  ThirdPartyStockSyncMessageDto,
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
      sku: Matchers.like('some_sku'),
      stock: Matchers.like(10),
    },
    dtoClass: ThirdPartyStockSyncMessageDto,
    name: 'third-party.event.stock.created',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integration_name'),
      },
      quantity: Matchers.like(15),
      sku: Matchers.like('some_sku'),
    },
    dtoClass: ThirdPartyStockChangedMessageDto,
    name: 'third-party.event.stock.added',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integration_name'),
      },
      quantity: Matchers.like(15),
      sku: Matchers.like('some_sku'),
    },
    dtoClass: ThirdPartyStockChangedMessageDto,
    name: 'third-party.event.stock.subtracted',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ThirdParty,
);

describe('Receive third party micro inventory message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
