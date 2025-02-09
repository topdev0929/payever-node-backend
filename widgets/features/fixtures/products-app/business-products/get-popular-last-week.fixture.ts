import * as moment from 'moment';

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
      lastSell: moment().subtract(1, 'day').toDate(),
      price: 12,
      quantity: 50,
      salePrice: 22,
      uuid: 'd8dbfd96-0d31-4ded-97af-b2bdcf7e72cb',
    },
    {
      businessId: someBusinessUuid,
      lastSell: moment().subtract(3, 'day').toDate(),
      price: 13,
      quantity: 100,
      salePrice: 23,
      uuid: '6933eb7c-63a9-4716-b854-13fa0b1e2405',
    },
    {
      businessId: someBusinessUuid,
      lastSell: moment().subtract(10, 'day').toDate(),
      price: 14,
      quantity: 1000,
      salePrice: 24,
      uuid: '8f4fa65b-c537-425e-8d83-27d399980579',
    },
  ]),
);
