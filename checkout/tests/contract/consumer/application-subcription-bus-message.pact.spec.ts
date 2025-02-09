import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { PePact, asyncConsumerChecker, ExpectedMessageDto } from '@pe/pact-kit';
import 'mocha';
import { RabbitBinding } from '../../../src/environments';
import { ToggleApplicationSubscriptionDto } from '../../../src/integration/dto/toggle-application-subscription.dto';
import { ProvidersEnum } from '../config/providers.enum';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('123abc'),
    },
    dtoClass: ToggleApplicationSubscriptionDto,
    name: RabbitBinding.ApplicationInstalled,
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('123abc'),
    },
    dtoClass: ToggleApplicationSubscriptionDto,
    name: RabbitBinding.ApplicationUninstalled,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.CommerceOs);

describe('Receive app-registry application bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
