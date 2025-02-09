import { fixture, combineFixtures } from '@pe/cucumber-sdk';

import { BusinessModel } from '@pe/business-kit';

import { businessFactory } from '../factories';

import constants from './constants';

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: constants.businessId },
  ]),
);
