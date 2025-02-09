import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { ToggleIntegrationSubscriptionDto } from '../../../../src/integration';
import { RabbitBinding } from '../../../../src/environments';
import { ProvidersEnum } from '../../config/providers.enum';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      category: Matchers.like('some category'),
      name: Matchers.like('some name'),
    },
    dtoClass: ToggleIntegrationSubscriptionDto,
    name: RabbitBinding.IntegrationInstalled,
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      category: Matchers.like('some category'),
      name: Matchers.like('some name'),
    },
    dtoClass: ToggleIntegrationSubscriptionDto,
    name: RabbitBinding.IntegrationUninstalled,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Connect);

describe('Receive business integration installation bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});
