import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RemoveBusinessDto } from '../../../src/mailer/dto';
import { BusinessDto } from '../../../src/mailer/dto/payment';
import { UserDto } from '../../../src/mailer/dto/payment/business';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      bankAccount: {
        _id: Matchers.uuid(),
        accountNumber: Matchers.like('Some account name'),
        bankCode: Matchers.like('Some bankCode'),
        bankName: Matchers.like('Some bank name'),
      },
      slug: Matchers.like('Some slug name'),
      uuid: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.export',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      bankAccount: {
        _id: Matchers.uuid(),
        accountNumber: Matchers.like('Some account name'),
        bankCode: Matchers.like('Some bankCode'),
        bankName: Matchers.like('Some bank name'),
      },
      slug: Matchers.like('Some slug name'),
      uuid: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      bankAccount: {
        _id: Matchers.uuid(),
        accountNumber: Matchers.like('Some account name'),
        bankCode: Matchers.like('Some bankCode'),
        bankName: Matchers.like('Some bank name'),
      },
      owner: {
        _id: Matchers.uuid(),
      },
      slug: Matchers.like('Some slug name'),
      uuid: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      email: Matchers.like('Some email'),
    },
    dtoClass: UserDto,
    name: 'users.event.user.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: 'users.event.business.removed',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Users
);

describe('Receive user bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
