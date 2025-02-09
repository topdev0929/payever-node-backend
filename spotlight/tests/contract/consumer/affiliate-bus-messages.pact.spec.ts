import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { AffiliateEventDto } from '../../../src/spotlight/apps/affiliate-app/dto';
import { AffiliateRabbitEventsEnum } from '../../../src/spotlight/apps/affiliate-app/enums';
import { ProvidersEnum } from '../config';

const affiliateEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  url: Matchers.string(),
  business: {
    id: Matchers.uuid()
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: affiliateEventMatcher,
    dtoClass: AffiliateEventDto,
    name: AffiliateRabbitEventsEnum.AffiliateCreated,
  },
  {
    contentMatcher: affiliateEventMatcher,
    dtoClass: AffiliateEventDto,
    name: AffiliateRabbitEventsEnum.AffiliateUpdated,
  },
  {
    contentMatcher: affiliateEventMatcher,
    dtoClass: AffiliateEventDto,
    name: AffiliateRabbitEventsEnum.AffiliateExported,
  },
  {
    contentMatcher: affiliateEventMatcher,
    dtoClass: AffiliateEventDto,
    name: AffiliateRabbitEventsEnum.AffiliateRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Affiliate);

describe('Receive affiliate bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
