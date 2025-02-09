import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ProvidersEnum } from '../config';
import { BusinessDto, BusinessMessagesEnum, RemoveBusinessDto } from '@pe/business-kit';

// override the env app name
process.env.APP_NAME = `nodejs-backend-builder`;

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      userAccountId: Matchers.uuid(),
      name: 'test',
    },
    dtoClass: BusinessDto,
    name: BusinessMessagesEnum.BusinessCreated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      userAccountId: Matchers.uuid(),
      name: 'test',
    },
    dtoClass: BusinessDto,
    name: BusinessMessagesEnum.BusinessUpdated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name:  BusinessMessagesEnum.BusinessRemoved,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.User);

describe('Receive user bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
