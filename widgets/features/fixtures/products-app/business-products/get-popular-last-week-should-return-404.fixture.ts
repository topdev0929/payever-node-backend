import { combineFixtures, fixture } from '@pe/cucumber-sdk';

import { BusinessModel } from '../../../../src/business';
import { BusinessProductAggregateModel } from '../../../../src/apps/products-app';
import { businessProductFactory } from '../../factories/business-product.factory';
import { businessFactory } from '../../factories/business.factory';

const someBusinessUuid: string = 'e5334cbc-fdf9-4b6d-9395-e0a8a8253006';

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: someBusinessUuid },
  ]),
  fixture<BusinessProductAggregateModel>('BusinessProductAggregateModel', businessProductFactory, [
    {
      businessId: someBusinessUuid,
    },
    {
      businessId: someBusinessUuid,
    },
    {
      businessId: someBusinessUuid,
    },
  ]),
);
