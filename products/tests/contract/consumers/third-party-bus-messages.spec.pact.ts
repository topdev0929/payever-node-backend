import 'reflect-metadata';
import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, PePact } from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';
import { IntegrationConnectedDisconnected, IntegrationExported, } from '../../../src/marketplace/dto';

const messages: any[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        category: Matchers.like('products'),
        name: Matchers.like('some integration name'),
      },
    },
    dtoClass: IntegrationConnectedDisconnected,
    name: RabbitEventNameEnum.ThirdPartyConnected,
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        category: Matchers.like('products'),
        name: Matchers.like('some integration name'),
      },
    },
    dtoClass: IntegrationConnectedDisconnected,
    name: RabbitEventNameEnum.ThirdPartyDisconnected,
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      connected: Matchers.like(true),
      id: Matchers.uuid(),
      name: Matchers.like('third party name'),
    },
    dtoClass: IntegrationExported,
    name: RabbitEventNameEnum.ThirdPartyExported,
  },
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive third-party micro message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
