import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { BusinessDto } from '@pe/business-kit';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.string('Business #1'),
    },
    dtoClass: BusinessDto,
    name: 'users.rpc.business.created',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.string('Business #1'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.removed',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      companyAddress: {
        city: Matchers.like('Some city name'),
        country: Matchers.like('Some country name'),
        street: Matchers.like('Some street name'),
        zipCode: Matchers.like('zip Code'),
      },
      name: Matchers.string('Business #1'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
