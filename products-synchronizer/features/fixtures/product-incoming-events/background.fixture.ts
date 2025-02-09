import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import { IntegrationModel } from '@pe/synchronizer-kit';
import { BusinessModel } from '@pe/business-kit';
import { businessFactory, integrationFactory } from '../factories';

const businessId = '9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1';
const integrationId = 'cc15c66f-65d6-4f1f-aae8-481056bd837d';

export = combineFixtures(
  fixture<IntegrationModel>('IntegrationModel', integrationFactory, [
    { _id: integrationId },
  ]),

  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: businessId },
  ]),
);
