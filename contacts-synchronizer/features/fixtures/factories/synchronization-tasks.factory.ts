import * as uuid from 'uuid';
import { DocumentDefinition } from 'mongoose';

import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { SynchronizationDirectionEnum, SynchronizationStatusEnum } from '@pe/synchronizer-kit';
import { randomFromList } from './helpers';
import { syncEventDefaultFactory } from './sync-event-factory';
import { SynchronizationTaskModel } from '../../../src/synchronizer/models';

export const synchronizationStatusEnumFactory = randomFromList([
  SynchronizationStatusEnum.IN_QUEUE,
  SynchronizationStatusEnum.IN_PROGRESS,
  SynchronizationStatusEnum.FAILURE,
  SynchronizationStatusEnum.SUCCEES,
]);

export const synchronizationDirectionEnumFactory = randomFromList([
  SynchronizationDirectionEnum.INWARD,
  SynchronizationDirectionEnum.OUTWARD,
]);

// tslint:disable-next-line:max-line-length
export const synchronizationTasksDefaultFactory = (
  seq: SequenceGenerator, statusEnumFactory: () => string,
  dirEnumFactory: () => string,
  events: () => any,
) => () => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    integrationId: uuid.v4(),
    status: statusEnumFactory(),
    direction: dirEnumFactory(),
    itemsSynced: 1500,
    events: [1, 2, 3].map(() => events()),
    startedAt: seq.currentDate,
    fileImport: uuid.v4(),
    errorsList: [],
    kind: null,
  }) as any;
};

export const synchronizationTaskFactory: PartialFactory<DocumentDefinition<SynchronizationTaskModel>> = partialFactory(
  synchronizationTasksDefaultFactory(
    new SequenceGenerator(0, 10000, new Date('2019-07-01T13:18:00.000Z')),
    synchronizationStatusEnumFactory,
    synchronizationDirectionEnumFactory,
    syncEventDefaultFactory(new SequenceGenerator()),
  ),
);
