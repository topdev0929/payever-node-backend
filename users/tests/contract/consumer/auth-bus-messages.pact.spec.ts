import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { BusinessPermissionDto, ImportUserFromAuthDto } from '../../../src/user';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      userId: Matchers.uuid(),
    },
    dtoClass: BusinessPermissionDto,
    name: 'business.event.permission.added',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      userId: Matchers.uuid(),
    },
    dtoClass: BusinessPermissionDto,
    name: 'business.event.permission.deleted',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      email: Matchers.like('some email'),
      firstName: Matchers.like('some firstName'),
      lastName: Matchers.like('some LastName'),
    },
    dtoClass: ImportUserFromAuthDto,
    name: 'auth.event.users.export',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Auth);

describe('Receive auth bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
