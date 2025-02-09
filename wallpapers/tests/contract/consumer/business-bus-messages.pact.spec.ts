import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { BusinessDto } from '@pe/business-kit';
import { BusinessRemoveDto } from '../../../src/wallpapers/dto';
import { ProvidersEnum } from '../config/providers.enum';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('some wallpaper'),
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
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('some wallpaper'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.updated',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('some wallpaper'),
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.export',
  },
]

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive users bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
