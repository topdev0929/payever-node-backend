import * as uuid from 'uuid';

import { uniqueString, SequenceGenerator, partialFactory } from '@pe/cucumber-sdk';
import { SynchronizationStatusEnum, SynchronizationDirectionEnum } from '../../../src/synchronizer/enums';
import { randomFromList } from './helpers';
import { syncEventDefaultFactory } from './sync-event-factory';

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
  seq: SequenceGenerator, statusEnumFactory: any,
  dirEnumFactory: any,
  events: any,
  ) => () => {
  seq.next();

  return {
    _id: uuid.v4(),
    businessId: uuid.v4(),
    integration: uuid.v4(),
    status: statusEnumFactory,
    direction: dirEnumFactory(),
    itemsSynced: 1500,
    events: [1, 2, 3].map(() => events()),
    startedAt: seq.currentDate,
    fileImport: '',
  };
};

export const synchronizationTaskFactory = partialFactory(
  synchronizationTasksDefaultFactory(
    new SequenceGenerator(0, 10000, new Date('2019-07-01T13:18:00.000Z')),
    synchronizationStatusEnumFactory,
    synchronizationDirectionEnumFactory,
    syncEventDefaultFactory(new SequenceGenerator()),
  ));
