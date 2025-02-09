import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import 'mocha';
import { IntegrationActionRequestDto } from '@pe/third-party-sdk';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('Some integration name'),
      },
      action: Matchers.like('sync-products'),
      data: {},
    },
    dtoClass: IntegrationActionRequestDto,
    name: 'synchronizer.event.action.call',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Synchronizer,
);

describe('Receive synchronizer bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
