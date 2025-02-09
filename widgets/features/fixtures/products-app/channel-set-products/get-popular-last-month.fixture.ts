import * as moment from 'moment';

import { BusinessModel } from '../../../../src/business';
import { ChannelSetProductAggregateModel } from '../../../../src/products-app';
import { ChannelSetModel } from '../../../../src/statistics';
import { businessFactory } from '../../factories/business.factory';
import { channelSetProductFactory } from '../../factories/channel-set-product.factory';
import { channelSetFactory } from '../../factories/channel-set.factory';
import { combineFixtures, fixture } from '@pe/cucumber-sdk';

const business1Uuid: string = 'e5334cbc-fdf9-4b6d-9395-e0a8a8253006';
const channelSet11Uuid: string = '90865876-8b5c-4f19-982b-7ae83afb97e1';
const channelSet12Uuid: string = 'cba91d7a-f0d3-4d29-9ca1-09de2d964df7';

const business2Uuid: string = '0d6b9f6b-676b-4248-bce5-2c7d47656b7c';
const channelSet21Uuid: string = 'cdfbc393-f4ea-47c1-9d85-ff1770e46a32';

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: business1Uuid },
    { _id: business2Uuid },
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
    {
      _id: channelSet21Uuid,
      businessId: business2Uuid,
    },
  ]),

  fixture<ChannelSetProductAggregateModel>('ChannelSetProductAggregateModel', channelSetProductFactory, [
    {
      channelSet: channelSet11Uuid,
      lastSell: moment().subtract(1, 'week').toDate(),
      price: 44,
      quantity: 50,
      salePrice: 34,
      uuid: 'd8dbfd96-0d31-4ded-97af-b2bdcf7e72cb',
    },
    {
      channelSet: channelSet11Uuid,
      lastSell: moment().subtract(3, 'weeks').toDate(),
      quantity: 1000,
      uuid: '6933eb7c-63a9-4716-b854-13fa0b1e2405',
    },
    {
      channelSet: channelSet11Uuid,
      lastSell: moment().subtract(10, 'weeks').toDate(),
      price: 46,
      quantity: 100,
      salePrice: 36,
      uuid: '8f4fa65b-c537-425e-8d83-27d399980579',
    },
    {
      channelSet: channelSet12Uuid,
      lastSell: moment().subtract(30, 'minutes').toDate(),
      quantity: 500,
      uuid: '2941b7a5-65b5-481d-af3d-3c6960f544e0',
    },
    {
      channelSet: channelSet21Uuid,
      uuid: '598c2249-b983-48f7-a764-3f55661f75fc',
    },
  ]),
);
