import {
  ExpectedMessageDto,
  asyncConsumerChecker,
  PePact,
} from '@pe/pact-kit';
import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { RabbitMessagesEnum } from '../../../src/enum';
import {
  SetDefaultTerminalDto,
  CreateTerminalDto,
  RemoveTerminalDto,
} from '../../../src/dto';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      terminalId: Matchers.uuid(),
    },
    dtoClass: SetDefaultTerminalDto,
    name: RabbitMessagesEnum.PosTerminalSetDefault,
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
      name: Matchers.like('some name'),
      business: {
        id: Matchers.uuid(),
      },
      channelSet: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: CreateTerminalDto,
    name: 'pos.event.terminal.created',
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
      name: Matchers.like('some name'),
      business: {
        id: Matchers.uuid(),
      },
      channelSet: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: CreateTerminalDto,
    name: 'pos.event.terminal.updated',
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
    },
    dtoClass: RemoveTerminalDto,
    name: RabbitMessagesEnum.PosTerminalRemoved,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Pos);

describe('Receive Pos bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
