import { fixture, combineFixtures } from '@pe/cucumber-sdk';
import { IntegrationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { synchronizationTaskFactory, integrationFactory } from '../factories';
import { SynchronizationStatusEnum } from '../../../src/synchronizer/enums';

const businessId = '9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1';
const integrationId = '41496020-408a-4cf4-9e82-e7e93358d90d';
const otherIntegrationId = '61c52807-7d7f-4c48-9aa7-e432103fdbdd';

export = combineFixtures(
  fixture<IntegrationModel>('IntegrationModel', integrationFactory, [
    { _id: integrationId }, { _id: otherIntegrationId },
  ]),
  fixture<SynchronizationTaskModel>('SynchronizationTaskModel', synchronizationTaskFactory as any, [
    {
      _id: '210fcf8d-fd28-4565-8a9c-404deb1dcf42',
      businessId: businessId,
      integration: integrationId,
      status: SynchronizationStatusEnum.IN_PROGRESS,
      direction: 'inward',
      itemsSynced: 1500,
    },
    {
      _id: 'edf931e4-4404-498a-93fb-d4edf7320214',
      businessId: businessId,
      integration: integrationId,
      status: SynchronizationStatusEnum.IN_QUEUE,
      direction: 'inward',
      itemsSynced: 1500,
      events: [
        {
          date: new Date(),
          itemId: 'some log message',
          message: '',
        },
        {
          date: new Date(),
          itemId: 'some other log message',
          message: '',
        },
      ],
    },
    {
      _id: 'ffab3970-e2ee-44a6-95c5-a2d75193da58',
      businessId: businessId,
      integration: otherIntegrationId,
      status: SynchronizationStatusEnum.IN_PROGRESS,
      direction: 'inward',
      itemsSynced: 1100,
    },
  ]),
);
