import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitMqEventEnum } from '../../../src/finance-express/enums/rabbit-mq.enum';
import { ProvidersEnum } from '../config';
import { ConnectThirdPartyDto } from '../../../src/finance-express/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: Matchers.uuid(),
      connection: Matchers.uuid(),
      integration: Matchers.like("Some name"),
    },
    dtoClass: ConnectThirdPartyDto,
    name: RabbitMqEventEnum.IntegrationDisconnected,
  }
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive third party messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
