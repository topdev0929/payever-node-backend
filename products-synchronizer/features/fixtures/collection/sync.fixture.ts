import { fixture, combineFixtures } from '@pe/cucumber-sdk';

import { BusinessModel } from '@pe/business-kit';
import { businessFactory, integrationFactory } from '../factories';
import { IntegrationModel } from '@pe/synchronizer-kit';
import constants from './constants';

export = combineFixtures(
    fixture<BusinessModel>('BusinessModel', businessFactory, [
      {
        _id: constants.businessId,
      },
    ]),
    fixture<IntegrationModel>('IntegrationModel', integrationFactory, [
      {
        _id: constants.integrationId,
        name: 'test',
      },
    ]),
);
