import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ConnectEventDto } from '../../../src/spotlight/apps/connect-app/dto';
import { ConnectRabbitEventsEnum } from '../../../src/spotlight/apps/connect-app/enums';
import { ProvidersEnum } from '../config';

const connectEventMatcher = {
  businessId: Matchers.uuid(),
  integrationSubscription: {
    businessId: Matchers.uuid(),
    id: Matchers.uuid(),
    integration: {
      name: Matchers.string(),
      category: Matchers.string(),
      categoryIcon: Matchers.string()
    }
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: connectEventMatcher,
    dtoClass: ConnectEventDto,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionCreated,
  },
  {
    contentMatcher: connectEventMatcher,
    dtoClass: ConnectEventDto,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionUpdated,
  },
  {
    contentMatcher: connectEventMatcher,
    dtoClass: ConnectEventDto,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionExported,
  },
  {
    contentMatcher: connectEventMatcher,
    dtoClass: ConnectEventDto,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionDeleted,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Connect);

describe('Receive connect bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
