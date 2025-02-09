import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ShopEventDto } from '../../../src/spotlight/apps/shop-app/dto';
import { ShopRabbitEventsEnum } from '../../../src/spotlight/apps/shop-app/enums';
import { ProvidersEnum } from '../config';

const shopEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  logo: Matchers.string(),
  domain: Matchers.string(),
  appType: Matchers.string(),
  business: {
    id: Matchers.uuid()
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: shopEventMatcher,
    dtoClass: ShopEventDto,
    name: ShopRabbitEventsEnum.ShopCreated,
  },
  {
    contentMatcher: shopEventMatcher,
    dtoClass: ShopEventDto,
    name: ShopRabbitEventsEnum.ShopUpdated,
  },
  {
    contentMatcher: shopEventMatcher,
    dtoClass: ShopEventDto,
    name: ShopRabbitEventsEnum.ShopExported,
  },
  {
    contentMatcher: shopEventMatcher,
    dtoClass: ShopEventDto,
    name: ShopRabbitEventsEnum.ShopRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Shop);

describe('Receive shop bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
