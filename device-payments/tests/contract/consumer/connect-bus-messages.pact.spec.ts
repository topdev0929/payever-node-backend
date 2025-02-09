import 'mocha';
import {
  ExpectedMessageDto,
  asyncConsumerChecker,
  PePact,
} from '@pe/pact-kit';
import { ConnectPayloadDto } from '../../../src/dto';
import { RabbitMessagesEnum } from '../../../src/enum';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      name: Matchers.like('Some name'),
      category: Matchers.like('some category'),
      businessId: Matchers.uuid(),
    },
    dtoClass: ConnectPayloadDto,
    name: RabbitMessagesEnum.ConnectThirdPartyEnabled,
  },
  {
    contentMatcher: {
      name: Matchers.like('Some name'),
      category: Matchers.like('some category'),
      businessId: Matchers.uuid(),
    },
    dtoClass: ConnectPayloadDto,
    name: RabbitMessagesEnum.ConnectThirdPartyEnabled,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Connect);

describe('Receive connect bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
