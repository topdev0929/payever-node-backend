import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import {
  asyncConsumerChecker,
  ExpectedMessageDto,
  PePact,
} from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import { CreateBusinessDto } from '../../../src/dto';
import { RabbitMessagesEnum } from '../../../src/enum';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: CreateBusinessDto,
    name: RabbitMessagesEnum.UsersBusinessCreated,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive users bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
