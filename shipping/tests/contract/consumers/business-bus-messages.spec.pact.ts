import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { RemoveBusinessDto } from '@pe/business-kit';
import { BusinessDto } from '../../../src/business/dto';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      currency: Matchers.like('EUR'),
      createdAt: Matchers.iso8601DateTimeWithMillis(),
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
      currency: Matchers.like('EUR'),
      createdAt: Matchers.iso8601DateTimeWithMillis(),
    },
    dtoClass: BusinessDto,
    name: RabbitEventNameEnum.BusinessUpdated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      currency: Matchers.like('EUR'),
      createdAt: Matchers.iso8601DateTimeWithMillis(),
    },
    dtoClass: BusinessDto,
    name: RabbitEventNameEnum.UsersEventBusinessExport,
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
