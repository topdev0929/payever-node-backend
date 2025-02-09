import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { BusinessModelLocal, BusinessSchemaName } from '../../../src/business';
import { businessFactory } from '../../factories';
import { ID_OF_EXISTING_BUSINESS } from '../const';

export = fixture<BusinessModelLocal>(getModelToken(BusinessSchemaName), businessFactory, [
  {
    _id: 'd5b25c5c-3684-4ab7-a769-c95f4c0f7546',
    excludedIntegrations: ['I1', 'I2'],
  },
  {
    _id: '2135dc62-c904-4b2c-8aaa-73083c3b2a94',
    excludedIntegrations: ['I1', 'I2'],
  },
  {
    _id: ID_OF_EXISTING_BUSINESS,
    name: 'business-number-one',
    logo: 'business-logo.png',
    enabled: true,
    owner: '9d8879ca-6573-41d8-8b2b-de93dd31f5ca',
  },
]);
