import { fixture, BaseFixture } from '@pe/cucumber-sdk';
import { Type } from '@nestjs/common';

import { BusinessLocalModel } from '../../../src/business/models';
import { businessFactory } from '../factories/business.factory';

const businessFixture: Type<BaseFixture> = fixture<BusinessLocalModel>('BusinessModel', businessFactory, [
  {
    _id: '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
    installations: [
      '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
      '3b8e9196-ccaa-4863-8f1e-19c18f2e4b90',
    ],
  },
]);

export = businessFixture;
