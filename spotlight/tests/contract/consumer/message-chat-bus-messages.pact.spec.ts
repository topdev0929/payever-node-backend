import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ChatEventDto } from '../../../src/spotlight/apps/message-app/dto';
import { ChatRabbitMessagesEnum } from '../../../src/spotlight/apps/message-app/enums';
import { ProvidersEnum } from '../config';

const chatEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  businessId: Matchers.uuid(),
  lastMessage: {
    content: Matchers.string()
  },
  photo: Matchers.string(),
  salt: Matchers.string()
};
const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: chatEventMatcher,
    dtoClass: ChatEventDto,
    name: ChatRabbitMessagesEnum.WidgetDataCreated,
  },
  {
    contentMatcher: chatEventMatcher,
    dtoClass: ChatEventDto,
    name: ChatRabbitMessagesEnum.WidgetDataUpdated,
  },
  {
    contentMatcher: chatEventMatcher,
    dtoClass: ChatEventDto,
    name: ChatRabbitMessagesEnum.WidgetDataExported,
  },
  {
    contentMatcher: chatEventMatcher,
    dtoClass: ChatEventDto,
    name: ChatRabbitMessagesEnum.WidgetDataDeleted,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Message);

describe('Receive chat message bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
