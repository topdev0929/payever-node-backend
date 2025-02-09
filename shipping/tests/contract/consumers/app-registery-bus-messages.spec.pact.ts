import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { AppRegistryEventDto } from '../../../src/business/dto';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('1a2b2f23c'),
    },
    dtoClass: AppRegistryEventDto,
    name: RabbitEventNameEnum.AppRegistryInstalled,
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('1a2b2f23c'),
    },
    dtoClass: AppRegistryEventDto,
    name: RabbitEventNameEnum.AppRegistryUninstalled,
  },
]

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.CommerceOs,
)

describe('Receive app-registry bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});
