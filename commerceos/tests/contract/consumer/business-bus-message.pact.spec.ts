import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { BusinessDto, BusinessRemoveDto } from '../../../src/business/dto';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      themeSettings: {
        theme: 'default',
      },
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: BusinessRemoveDto,
    name: 'users.event.business.removed',
  },
];

const messagePactUsers: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePactUsers, message);
    });
  }
});
