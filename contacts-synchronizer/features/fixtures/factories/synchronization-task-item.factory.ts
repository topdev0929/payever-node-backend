import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator, PartialFactory } from '@pe/cucumber-sdk';
import { DocumentDefinition } from 'mongoose';

import { SynchronizationTaskItemModel } from '../../../src/synchronizer/models';

const seq = new SequenceGenerator();

const defaultFactory = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    isProcessed: false,
    email: `EMAIL_${seq.current}`,
    taskId: uuid.v4(),
    type: `type_${seq.current}`,
  } as unknown as DocumentDefinition<SynchronizationTaskItemModel>;
};

export const synchronizationTaskItemFactory: PartialFactory<DocumentDefinition<SynchronizationTaskItemModel>> =
  partialFactory(defaultFactory);
