import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitMqEventEnum } from '../../../src/finance-express/enums/rabbit-mq.enum';
import { CheckoutConnectionDto } from '../../../src/finance-express/dto/checkout-connection.dto';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      checkout: {
        _id: Matchers.uuid()
      },
      connection: {
        _id: Matchers.uuid(),
        businessId: Matchers.uuid(),
        integration: Matchers.uuid()
      },
      integration: {
        name: Matchers.like("Some name")
      },
    },
    dtoClass: CheckoutConnectionDto,
    name: RabbitMqEventEnum.CheckoutConnectionInstalled,
  },
  {
    contentMatcher: {
      checkout: {
        _id: Matchers.uuid()
      },
      connection: {
        _id: Matchers.uuid(),
        businessId: Matchers.uuid(),
        integration: Matchers.uuid()
      },
      integration: {
        name: Matchers.like("Some name")
      },
    },
    dtoClass: CheckoutConnectionDto,
    name: RabbitMqEventEnum.CheckoutConnectionUninstalled,
  }
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Checkout);

describe('Receive checkout connection messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
