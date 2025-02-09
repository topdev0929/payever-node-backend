import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { BusinessDto, BusinessRabbitMessagesEnum, RemoveBusinessDto } from '../../../src/business';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.string(),
      userAccountId: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: BusinessRabbitMessagesEnum.BusinessCreated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.string(),
      userAccountId: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: BusinessRabbitMessagesEnum.BusinessUpdated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: BusinessRabbitMessagesEnum.BusinessDeleted,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.string(),
      userAccountId: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: BusinessRabbitMessagesEnum.BusinessExported,
  }
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive user business messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
