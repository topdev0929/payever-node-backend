import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { SubscriptionsEventDto } from '../../../src/spotlight/apps/subscriptions-app/dto';
import { SubscriptionsRabbitEventsEnum } from '../../../src/spotlight/apps/subscriptions-app/enums';
import { ProvidersEnum } from '../config';

const subscriptionsEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  business: {
    id: Matchers.uuid()
  },
  planType: Matchers.string()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: subscriptionsEventMatcher,
    dtoClass: SubscriptionsEventDto,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsCreated,
  },
  {
    contentMatcher: subscriptionsEventMatcher,
    dtoClass: SubscriptionsEventDto,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsUpdated,
  },
  {
    contentMatcher: subscriptionsEventMatcher,
    dtoClass: SubscriptionsEventDto,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsExported,
  },
  {
    contentMatcher: subscriptionsEventMatcher,
    dtoClass: SubscriptionsEventDto,
    name: SubscriptionsRabbitEventsEnum.SubscriptionsRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Subscription);

describe('Receive subscriptions bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
