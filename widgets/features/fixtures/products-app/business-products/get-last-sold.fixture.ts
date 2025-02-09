import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';

import { BusinessModel } from '../../../../src/business';
import { BusinessLastSoldProductsListModel, BusinessProductAggregateModel } from '../../../../src/apps/products-app';
import { businessLastSoldProductListFactory } from '../../factories/business-last-sold-product-list.factory';
import { businessProductFactory } from '../../factories/business-product.factory';
import { businessFactory } from '../../factories/business.factory';

const someBusinessUuid: string = 'e5334cbc-fdf9-4b6d-9395-e0a8a8253006';

const products: any[] = [
  {
    businessId: someBusinessUuid,
    lastSell: moment().subtract(1, 'day').toDate(),
    price: 1,
    quantity: 50,
    salePrice: 2,
    uuid: 'd8dbfd96-0d31-4ded-97af-b2bdcf7e72cb',
  },
  {
    businessId: someBusinessUuid,
    lastSell: moment().subtract(3, 'day').toDate(),
    price: 3,
    quantity: 100,
    salePrice: 4,
    uuid: '6933eb7c-63a9-4716-b854-13fa0b1e2405',
  },
  {
    businessId: someBusinessUuid,
    lastSell: moment().subtract(10, 'minutes').toDate(),
    price: 5,
    quantity: 1000,
    salePrice: 6,
    uuid: '8f4fa65b-c537-425e-8d83-27d399980579',
  },
];

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: someBusinessUuid },
  ]),
  fixture<BusinessProductAggregateModel>('BusinessProductAggregateModel', businessProductFactory, products),
  fixture<BusinessLastSoldProductsListModel>('BusinessLastSoldProductsListModel', businessLastSoldProductListFactory, [
    {
      _id: someBusinessUuid,
      products,
    },
  ]),
);
