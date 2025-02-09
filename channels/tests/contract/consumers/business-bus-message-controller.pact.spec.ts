import 'mocha';
import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { BusinessDto, RemoveBusinessDto } from '@pe/business-kit'
import { Matchers } from '@pact-foundation/pact';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('Business')
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      owner: Matchers.like('some owner'),
      userAccount: {
        firstName: Matchers.like('Name'),
        lastName: Matchers.like('Last Name'),
        phone: Matchers.like('9 9999 9999'),
        email: Matchers.EMAIL_FORMAT
      },
      userAccountId: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: 'users.event.business.removed',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('Business update')
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
];

const messagePactUsers = PePact.getMessageConsumer(ProvidersEnum.Users)

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePactUsers, message);
    });
  }
});
