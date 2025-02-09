import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq = new SequenceGenerator();

const defaultFactory = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    isProcessed: false,
    sku: `SKU_${seq.current}`,
    task: uuid.v4(),
    type: `type_${seq.current}`,
  };
};

export const synchronizationTaskItemFactory = partialFactory(defaultFactory);
