import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import {
  InventoryEventStockAddedDto,
  InventoryEventStockSubtractedDto,
  InventoryEventInventorySynchronizationSucceededDto,
  InventoryEventInventorySynchronizationFailedDto,
  InventoryEventStockSynchronizeDto,
} from '../../../src/synchronizer/dto';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: any[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      quantity: Matchers.like(10),
      sku: Matchers.like('test_string'),
      stock: Matchers.like(12),
    },
    dtoClass: InventoryEventStockAddedDto,
    name: 'inventory.event.stock.added',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      quantity: Matchers.like(10),
      sku: Matchers.like('test_string'),
      stock: Matchers.like(12),
    },
    dtoClass: InventoryEventStockSubtractedDto,
    name: 'inventory.event.stock.subtracted',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      sku: Matchers.like('test_string'),
      stock: Matchers.like(12),
    },
    dtoClass: InventoryEventStockSynchronizeDto,
    name: 'inventory.event.stock.synchronize',
  },
  {
    contentMatcher: {
      inventory: {
        sku: Matchers.like('test_string'),
      },
      synchronizationTask: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: InventoryEventInventorySynchronizationSucceededDto,
    name: 'inventory.event.inventory-synchronization.succeeded',
  },
  {
    contentMatcher: {
      errorMessage: Matchers.like('Some Error message'),
      inventory: {
        sku: Matchers.like('test_string'),
      },
      synchronizationTask: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: InventoryEventInventorySynchronizationFailedDto,
    name: 'inventory.event.inventory-synchronization.failed',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Inventory,
);

describe('Receive inventory micro message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
