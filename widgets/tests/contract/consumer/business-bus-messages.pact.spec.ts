import 'mocha';
import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { BusinessDto, RemoveBusinessDto } from '@pe/business-kit';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
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
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.export',
  },
];

const messagePactUsers: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Users,
);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePactUsers, message);
    });
  }
});
