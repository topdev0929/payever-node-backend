import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { UserDataDto } from '../../../src/user';
import { ProvidersEnum, pactConfiguration } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      userAccount: { },
    },
    dtoClass: UserDataDto,
    name: 'users.event.user.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      userAccount: { },
    },
    dtoClass: UserDataDto,
    name: 'users.event.user.export',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Users,
);

describe('Receive Users bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
