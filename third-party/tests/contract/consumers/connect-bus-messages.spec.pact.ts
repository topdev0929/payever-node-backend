import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import 'mocha';
import { ToggleIntegrationSubscriptionDto } from '@pe/third-party-sdk';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      name: Matchers.like('Some integration name'),
    },
    dtoClass: ToggleIntegrationSubscriptionDto,
    name: 'connect.event.third-party.enabled',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      name: Matchers.like('Some integration name'),
    },
    dtoClass: ToggleIntegrationSubscriptionDto,
    name: 'connect.event.third-party.disabled',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Connect,
);

describe('Receive connect bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
