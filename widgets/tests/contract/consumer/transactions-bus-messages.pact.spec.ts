import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { TransactionPaymentSubtractDto, TransactionPaymentRemoveDto, TransactionPaymentAddDto } from '../../../src/statistics';

const date: string = '2019-12-09T12:32:35.990Z';
const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      amount: Matchers.like(23.2),
      business: {
        id: Matchers.uuid(),
      },
      channel_set: {
        id: Matchers.uuid(),
      },
      date: Matchers.like(date),
      id: Matchers.uuid(),
      items: eachLike({
        _id: Matchers.uuid(),
        identifier: Matchers.like('Some identifier'),
        name: Matchers.like('Some name'),
        price: Matchers.like(12.23),
        price_net: Matchers.like(22.32),
        quantity: Matchers.like(12.32),
        thumbnail: Matchers.like('Some thumbnail'),
        uuid: Matchers.uuid(),
        vat_rate: Matchers.like(2.0),
      }),
      last_updated: Matchers.like(date),
    },
    dtoClass: TransactionPaymentAddDto,
    name: 'transactions.event.payment.add',
  },
  {
    contentMatcher: {
      amount: Matchers.like(23.2),
      business: {
        id: Matchers.uuid(),
      },
      channel_set: {
        id: Matchers.uuid(),
      },
      date: Matchers.like(date),
      id: Matchers.uuid(),
      last_updated: Matchers.like(date),
    },
    dtoClass: TransactionPaymentSubtractDto,
    name: 'transactions.event.payment.subtract',
  },
  {
    contentMatcher: {
      amount: Matchers.like(23.2),
      business: {
        id: Matchers.uuid(),
      },
      channel_set: {
        id: Matchers.uuid(),
      },
      date: Matchers.like(date),
      id: Matchers.uuid(),
    },
    dtoClass: TransactionPaymentRemoveDto,
    name: 'transactions.event.payment.removed',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Transactions,
);

describe('Receive Transactions bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
