import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import 'mocha';
import { BusinessEventSubscriptionDto, RemoveBusinessDto } from '../../../src/business/dto';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('Some business name'),
    },
    dtoClass: BusinessEventSubscriptionDto,
    name: 'users.event.business.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: 'users.event.business.removed',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      createdAt: Matchers.iso8601DateTimeWithMillis(),
      name: Matchers.like('Some business name'),
    },
    dtoClass: BusinessEventSubscriptionDto,
    name: 'users.event.business.updated',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      createdAt: Matchers.iso8601DateTimeWithMillis(),
      name: Matchers.like('Some business name'),
    },
    dtoClass: BusinessEventSubscriptionDto,
    name: 'users.event.business.export',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Users,
);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});
