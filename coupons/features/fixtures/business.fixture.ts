import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { businessFactory } from '../factories/business-factory';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';

export = fixture<BusinessModel>(getModelToken(BusinessSchemaName), businessFactory, [
    {
      _id: '376f8103-0e09-449a-8538-9384f2f1b992',
    } as BusinessModel,
]);
