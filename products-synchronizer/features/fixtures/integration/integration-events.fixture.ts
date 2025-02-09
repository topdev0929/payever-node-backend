import { fixture, combineFixtures } from '@pe/cucumber-sdk';
import { businessFactory, integrationFactory } from '../factories';
import { IntegrationModel, SynchronizationModel } from '@pe/synchronizer-kit';
import { synchronizationFactory } from '../factories/synchronization.factory';
import constants from './constants';
import { BusinessModel } from '@pe/business-kit';

export = combineFixtures(
    fixture<BusinessModel>('BusinessModel', businessFactory, [
      {
        _id: constants.businessId,
      },
    ]),
  fixture<IntegrationModel>('IntegrationModel', integrationFactory, [
    {
      _id: constants.integrationId,
      name: "test",
    },
  ]),
  fixture<SynchronizationModel>('SynchronizationModel', synchronizationFactory as any, [
    {
      _id: 'bc50772b-c31f-4fd1-b5b4-602f3c1bd02a',
      isInwardEnabled: false,
      isOutwardEnabled: false,
      businessId: constants.businessId,
      integration: constants.integrationId,
    },
  ]),
);
