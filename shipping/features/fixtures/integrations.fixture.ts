import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { IntegrationModel } from '../../src/integration/models';
import { integrationFactory } from './factories/integration-factory';

export = fixture<IntegrationModel>(getModelToken('Integration'), integrationFactory, [
  {
    _id: '06b3464b-9ed2-4952-9cb8-07aac0108a55',
    allowedBusinesses: ['d5b25c5c-3684-4ab7-a769-c95f4c0f7546'],
  },
]);
