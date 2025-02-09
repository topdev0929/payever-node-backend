import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { TransactionEventDto } from '../../../src/spotlight/apps/transactions-app/dto';
import { TransactionRabbitMessagesEnum } from '../../../src/spotlight/apps/transactions-app/enums';
import { ProvidersEnum } from '../config';

const transactionsEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  business: {
    id: Matchers.uuid()
  },
  customer: {
    name: Matchers.string()
  },
  channel: Matchers.string(),
  amount: Matchers.integer(),
  reference: Matchers.string(),
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: transactionsEventMatcher,
    dtoClass: TransactionEventDto,
    name: TransactionRabbitMessagesEnum.TransactionCreated,
  },
  {
    contentMatcher: transactionsEventMatcher,
    dtoClass: TransactionEventDto,
    name: TransactionRabbitMessagesEnum.TransactionExport,
  },
  {
    contentMatcher: transactionsEventMatcher,
    dtoClass: TransactionEventDto,
    name: TransactionRabbitMessagesEnum.TransactionRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Transactions);

describe('Receive transactions bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
