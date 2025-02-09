import * as moment from 'moment';

import { BusinessModel } from '../../../../src/business';
import { ChannelSetLastSoldProductsListModel } from '../../../../src/products-app';
import { ChannelSetModel } from '../../../../src/statistics';
import { businessFactory } from '../../factories/business.factory';
import { channelSetLastSoldProductListFactory } from '../../factories/channel-set-last-sold-product-list-factory';
import { channelSetFactory } from '../../factories/channel-set.factory';
import { combineFixtures, fixture } from '@pe/cucumber-sdk';

const business1Uuid: string = 'e5334cbc-fdf9-4b6d-9395-e0a8a8253006';
const channelSet11Uuid: string = '90865876-8b5c-4f19-982b-7ae83afb97e1';
const channelSet12Uuid: string = 'cba91d7a-f0d3-4d29-9ca1-09de2d964df7';

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: business1Uuid },
  ]),

  fixture<ChannelSetModel>('ChannelSetModel', channelSetFactory, [
    {
      _id: channelSet11Uuid,
      businessId: business1Uuid,
    },
    {
      _id: channelSet12Uuid,
      businessId: business1Uuid,
    },
  ]),

  fixture<ChannelSetLastSoldProductsListModel>(
    'ChannelSetLastSoldProductsListModel',
    channelSetLastSoldProductListFactory,
    [
      {
        _id: channelSet11Uuid,
        products: [
          {
            channelSet: channelSet11Uuid,
            lastSell: moment().subtract(1, 'day').toDate(),
            price: 47,
            quantity: 50,
            salePrice: 37,
            uuid: 'd8dbfd96-0d31-4ded-97af-b2bdcf7e72cb',
          },
          {
            channelSet: channelSet11Uuid,
            lastSell: moment().subtract(3, 'days').toDate(),
            price: 48,
            quantity: 1000,
            salePrice: 38,
            uuid: '6933eb7c-63a9-4716-b854-13fa0b1e2405',
          },
          {
            channelSet: channelSet11Uuid,
            lastSell: moment().subtract(10, 'minutes').toDate(),
            quantity: 100,
            uuid: '8f4fa65b-c537-425e-8d83-27d399980579',
          },
        ],
      },
    ],
  ),
);
