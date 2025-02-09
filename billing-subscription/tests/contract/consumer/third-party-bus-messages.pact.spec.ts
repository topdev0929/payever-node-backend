import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitBinding } from '../../../src/environments';
import { IntegrationConnectedRmqMessageDto } from '../../../src/integrations/dtos';
import { SubscriptionChangedDto } from '../../../src/subscriptions/dto';
import { ProvidersEnum } from '../config';


const integrationConnectionEventMatcher = {
  business: {
    id: Matchers.uuid()
  },
  connection: {
    id: Matchers.uuid(),
    isEnabled: Matchers.boolean()
  },
  integration: {
    category: Matchers.string(),
    name: Matchers.string()
  }
};

const subscriptionChangedEventMatcher = {
  externalId: Matchers.string(),
  paymentMethod: Matchers.string(),
  subscriptionState: Matchers.string()
}

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: integrationConnectionEventMatcher,
    dtoClass: IntegrationConnectedRmqMessageDto,
    name: RabbitBinding.ThirdPartyIntegrationConnected,
  },
  {
    contentMatcher: integrationConnectionEventMatcher,
    dtoClass: IntegrationConnectedRmqMessageDto,
    name: RabbitBinding.ThirdPartyIntegrationConnectionExported,
  },
  {
    contentMatcher: integrationConnectionEventMatcher,
    dtoClass: IntegrationConnectedRmqMessageDto,
    name: RabbitBinding.ThirdPartyIntegrationDisconnected,
  },
  {
    contentMatcher: subscriptionChangedEventMatcher,
    dtoClass: SubscriptionChangedDto,
    name: RabbitBinding.SubscriptionEvent,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive third party connection bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
