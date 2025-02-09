import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import 'mocha';
import {
  BusinessAwareDto,
  StockChangedDto,
  StockSyncDto,
} from '../../../src/inventory/dto/rmq';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: BusinessAwareDto,
    name: 'synchronizer.event.inventory.synchronize',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      sku: Matchers.like('test_sku'),
      stock: Matchers.like(10),
    },
    dtoClass: StockSyncDto,
    name: 'synchronizer.event.outer-stock.created no synchronization task',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      sku: Matchers.like('test_sku'),
      stock: Matchers.like(10),
      synchronizationTask: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: StockSyncDto,
    name: 'synchronizer.event.outer-stock.created with synchronization task',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      quantity: Matchers.like(10),
      sku: Matchers.like('test_sku'),
    },
    dtoClass: StockChangedDto,
    name: 'synchronizer.event.outer-stock.added',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      quantity: Matchers.like(10),
      sku: Matchers.like('test_sku'),
    },
    dtoClass: StockChangedDto,
    name: 'synchronizer.event.outer-stock.subtracted',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Synchronizer
);

describe('Receive synchronizer bus messages micro message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
