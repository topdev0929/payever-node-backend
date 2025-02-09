import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { IntegrationEventDto } from '../../../src/integration/dto';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      name: Matchers.like('ebay'),
      category: Matchers.like('fashion'),
      businessId: Matchers.uuid(),
    },
    dtoClass: IntegrationEventDto,
    name: RabbitEventNameEnum.AppInstalled,
  },
  {
    contentMatcher: {
      name: Matchers.like('ebay'),
      category: Matchers.like('fashion'),
      businessId: Matchers.uuid(),
    },
    dtoClass: IntegrationEventDto,
    name: RabbitEventNameEnum.AppUninstalled,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Connect,
);

describe('Receive Connect bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});
