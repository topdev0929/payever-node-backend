import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { BusinessModelLocal, BusinessSchemaName } from '../../../src/business';
import { businessFactory } from '../../factories';

export = fixture<BusinessModelLocal>(getModelToken(BusinessSchemaName), businessFactory, [
  {
    _id: 'd5b25c5c-3684-4ab7-a769-c95f4c0f7546',
  },
]);
