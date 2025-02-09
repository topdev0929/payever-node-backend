import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import { SynchronizationModel, SynchronizationTaskModel, IntegrationModel } from '@pe/synchronizer-kit';
import { integrationFactory, synchronizationTaskFactory } from '../factories';
import { synchronizationFactory } from '../factories/synchronization.factory';
import { SynchronizationStatusEnum } from '../../../src/synchronizer/enums';

const businessId = '9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1';
const integrationId = 'd7019d86-02ae-4ac3-ad37-da6b24603842';
const otherIntegrationId = '3aee8f3b-8e60-4e64-9e16-ccdb6062402d';

export = combineFixtures(
  fixture<IntegrationModel>('IntegrationModel', integrationFactory, [
    {
      _id: integrationId,
      name: 'some-integration',
    },
    {
      _id: otherIntegrationId,
      name: 'some-other-integration',
    },
  ]),

  fixture<SynchronizationModel>('SynchronizationModel', synchronizationFactory as any, [
    {
      _id: 'bc50772b-c31f-4fd1-b5b4-602f3c1bd02a',
      businessId: businessId,
      integration: integrationId,
      isOutwardEnabled: true,
      isInwardEnabled: false,
    },
    {
      _id: '37979726-88b8-4222-987a-490458589b8b',
      businessId: businessId,
      integration: otherIntegrationId,
      isOutwardEnabled: true,
      isInwardEnabled: false,
    },
  ]),

  fixture<SynchronizationTaskModel>('SynchronizationTaskModel', synchronizationTaskFactory as any, [
    {
      _id: '210fcf8d-fd28-4565-8a9c-404deb1dcf42',
      businessId: businessId,
      integration: integrationId,
      status: SynchronizationStatusEnum.IN_PROGRESS,
      direction: 'outward',
      itemsSynced: 0,
      events: [],
    },
  ]),
);
