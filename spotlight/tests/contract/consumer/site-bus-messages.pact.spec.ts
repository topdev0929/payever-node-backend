import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { SiteEventDto } from '../../../src/spotlight/apps/site-app/dto';
import { SiteRabbitEventsEnum } from '../../../src/spotlight/apps/site-app/enums';
import { ProvidersEnum } from '../config';

const siteEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  domain: Matchers.string(),
  appType: Matchers.string(),
  business: {
    id: Matchers.uuid()
  }
};

const siteRemovedEventMatcher = {
  id: Matchers.uuid(),
  appType: Matchers.string(),
  type: Matchers.string(),
  business: {
    id: Matchers.uuid()
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: siteEventMatcher,
    dtoClass: SiteEventDto,
    name: SiteRabbitEventsEnum.SiteCreated,
  },
  {
    contentMatcher: siteEventMatcher,
    dtoClass: SiteEventDto,
    name: SiteRabbitEventsEnum.SiteUpdated,
  },
  {
    contentMatcher: siteEventMatcher,
    dtoClass: SiteEventDto,
    name: SiteRabbitEventsEnum.SiteExported,
  },
  {
    contentMatcher: siteRemovedEventMatcher,
    dtoClass: SiteEventDto,
    name: SiteRabbitEventsEnum.SiteRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Site);

describe('Receive site bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
