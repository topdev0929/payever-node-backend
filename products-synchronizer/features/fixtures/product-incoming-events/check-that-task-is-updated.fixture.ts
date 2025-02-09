import { fixture } from '@pe/cucumber-sdk';
import { SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { synchronizationTaskFactory } from '../factories';
import { SynchronizationStatusEnum } from '../../../src/synchronizer/enums';

const businessId = '9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1';
const integrationId = 'cc15c66f-65d6-4f1f-aae8-481056bd837d';

export = fixture<SynchronizationTaskModel>('SynchronizationTaskModel', synchronizationTaskFactory as any, [
  {
    _id: '210fcf8d-fd28-4565-8a9c-404deb1dcf42',
    businessId: businessId,
    integration: integrationId,
    status: SynchronizationStatusEnum.IN_PROGRESS,
    direction: 'inward',
    itemsSynced: 0,
    events: [],
  },
]);
