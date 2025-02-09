import 'mocha';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import { Matchers } from '@pact-foundation/pact';
import { BusinessDto, RemoveBusinessDto } from '@pe/business-kit';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('Media Markt'),
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
      name: Matchers.like('Saturn'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive builder bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
