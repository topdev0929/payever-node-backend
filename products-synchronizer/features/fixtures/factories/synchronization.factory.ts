import { v4 as uuid } from 'uuid';

import { SequenceGenerator, partialFactory } from '@pe/cucumber-sdk';

export const synchronizationDefaultFactory = (seq: SequenceGenerator) => () => {
  seq.next();

  return {
    _id: uuid(),
    businessId: uuid(),
    integration: uuid(),
    isInwardEnabled: true,
    inOutwardEnabled: true,
    isInventorySyncEnabled: true,
    lastSynced: new Date().toISOString(),
  };
};

export const synchronizationFactory = partialFactory(synchronizationDefaultFactory(new SequenceGenerator()));
