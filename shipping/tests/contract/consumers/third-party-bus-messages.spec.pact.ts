import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';
import { ThirdPartyConnectionChangedDto } from '../../../src/integration/dto';

const thirdPartyConnectionChanged: any = {
  business: {
    id: Matchers.uuid(),
  },
  connection: {
    id: Matchers.uuid(),
    name: Matchers.like('Some name'),
  },
  integration: {
    name: Matchers.like('Some name'),
  },
}

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: thirdPartyConnectionChanged,
    dtoClass: ThirdPartyConnectionChangedDto,
    name: RabbitEventNameEnum.ThirdPartyConnected,
  },
  {
    contentMatcher: thirdPartyConnectionChanged,
    dtoClass: ThirdPartyConnectionChangedDto,
    name: RabbitEventNameEnum.ThirdPartyDisconnected,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ThirdParty,
);

describe('Receive third-party bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
