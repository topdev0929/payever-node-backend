import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { PosTerminalEventDto } from '../../../src/spotlight/apps/pos-app/dto';
import { PosRabbitMessagesEnum } from '../../../src/spotlight/apps/pos-app/enums';
import { ProvidersEnum } from '../config';

const posEventMatcher = {
  id: Matchers.uuid(),
  logo: Matchers.string(),
  name: Matchers.string(),
  active: Matchers.boolean(),
  business: {
    id: Matchers.uuid()
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: posEventMatcher,
    dtoClass: PosTerminalEventDto,
    name: PosRabbitMessagesEnum.TerminalCreated,
  },
  {
    contentMatcher: posEventMatcher,
    dtoClass: PosTerminalEventDto,
    name: PosRabbitMessagesEnum.TerminalUpdated,
  },
  {
    contentMatcher: posEventMatcher,
    dtoClass: PosTerminalEventDto,
    name: PosRabbitMessagesEnum.TerminalExport,
  },
  {
    contentMatcher: posEventMatcher,
    dtoClass: PosTerminalEventDto,
    name: PosRabbitMessagesEnum.TerminalRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Pos);

describe('Receive pos bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
