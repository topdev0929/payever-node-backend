import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { SocialEventDto } from '../../../src/spotlight/apps/social-app/dto';
import { SocialRabbitEventsEnum } from '../../../src/spotlight/apps/social-app/enums';
import { ProvidersEnum } from '../config';

const invoiceEventMatcher = {
  id: Matchers.uuid(),
  businessId: Matchers.uuid(),
  title: Matchers.string(),
  content: Matchers.string(),
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: SocialEventDto,
    name: SocialRabbitEventsEnum.SocialCreated,
  },
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: SocialEventDto,
    name: SocialRabbitEventsEnum.SocialUpdated,
  },
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: SocialEventDto,
    name: SocialRabbitEventsEnum.SocialExported,
  },
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: SocialEventDto,
    name: SocialRabbitEventsEnum.SocialRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Social);

describe('Receive social bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
