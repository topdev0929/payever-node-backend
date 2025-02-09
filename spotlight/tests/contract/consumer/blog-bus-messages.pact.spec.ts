import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { BlogEventDto } from '../../../src/spotlight/apps/blog-app/dto';
import { BlogRabbitEventsEnum } from '../../../src/spotlight/apps/blog-app/enums';
import { ProvidersEnum } from '../config';

const blogEventMatcher = {
  id: Matchers.uuid(),
  business: {
    id: Matchers.uuid()
  },
  name: Matchers.string(),
  picture: Matchers.string()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: blogEventMatcher,
    dtoClass: BlogEventDto,
    name: BlogRabbitEventsEnum.BlogCreated,
  },
  {
    contentMatcher: blogEventMatcher,
    dtoClass: BlogEventDto,
    name: BlogRabbitEventsEnum.BlogUpdated,
  },
  {
    contentMatcher: blogEventMatcher,
    dtoClass: BlogEventDto,
    name: BlogRabbitEventsEnum.BlogExported,
  },
  {
    contentMatcher: blogEventMatcher,
    dtoClass: BlogEventDto,
    name: BlogRabbitEventsEnum.BlogRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Blog);

describe('Receive blog bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
