import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { ThirdPartyConnectionChangedDto } from '../../../../src/integration';
import { RabbitBinding } from '../../../../src/environments';
import { ProvidersEnum } from '../../config/providers.enum';

const thirdPartyConnectionChanged: any = {
  business: {
    id: Matchers.uuid(),
  },
  connection: {
    id: Matchers.uuid(),
    name: Matchers.like('Some Name'),
  },
  integration: {
    name: Matchers.like('Some Name'),
  },
}

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: thirdPartyConnectionChanged,
    dtoClass: ThirdPartyConnectionChangedDto,
    name: RabbitBinding.ThirdPartyConnected,
  },
  {
    contentMatcher: thirdPartyConnectionChanged,
    dtoClass: ThirdPartyConnectionChangedDto,
    name: RabbitBinding.ThirdPartyDisconnected,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive business third-party bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});
