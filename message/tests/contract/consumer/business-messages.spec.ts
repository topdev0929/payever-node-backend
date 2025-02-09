import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { BusinessDto } from '@pe/business-kit';
import { ProvidersEnum } from '../config/providers.enum';


const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      userAccountId: Matchers.uuid(),
      name: Matchers.string()
    },
    dtoClass: BusinessDto,
    name: 'users.event.business.created',
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.User);

describe('Receive user bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
