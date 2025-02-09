import { fixture, combineFixtures } from '@pe/cucumber-sdk';

import { BusinessModel } from '@pe/business-kit';

import { businessFactory } from '../factories';
import { BUSINESS_ID, FOREIGN_BUSINESS_ID } from './const';

export = fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: BUSINESS_ID },
    { _id: FOREIGN_BUSINESS_ID },
]);
