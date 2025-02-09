import 'mocha';
import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import { BusinessDto, RemoveBusinessDto } from '../../../src/business/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      companyAddress: {
        city: Matchers.like('Berlin'),
        country: Matchers.like('DE'),
        street: Matchers.like('some street'),
        zipCode: Matchers.like('1234'),
      },
      companyDetails: {
        industry: Matchers.like('Some Industry'),
        product: Matchers.like('Some Product'),
      },
      currency: Matchers.like('EUR'),
      name: Matchers.like('test'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      companyAddress: {
        city: Matchers.like('Berlin'),
        country: Matchers.like('DE'),
        street: Matchers.like('some street'),
        zipCode: Matchers.like('1234'),
      },
      companyDetails: {
        industry: Matchers.like('Some Industry'),
        product: Matchers.like('Some Product'),
      },
      currency: Matchers.like('EUR'),
      name: Matchers.like('test'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      companyAddress: {
        city: Matchers.like('Berlin'),
        country: Matchers.like('DE'),
        street: Matchers.like('some street'),
        zipCode: Matchers.like('1234'),
      },
      companyDetails: {
        industry: Matchers.like('Some Industry'),
        product: Matchers.like('Some Product'),
      },
      currency: Matchers.like('EUR'),
      name: Matchers.like('test'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.export',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: 'users.event.business.removed',
  },
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
