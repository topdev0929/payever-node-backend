import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq-names.enum';
import { BusinessDto, RemoveBusinessDto } from '../../../src/business/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: RabbitEventNameEnum.BusinessCreated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: RabbitEventNameEnum.BusinessRemoved,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: BusinessDto,
    name: RabbitEventNameEnum.BusinessUpdated,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Users,
);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});
