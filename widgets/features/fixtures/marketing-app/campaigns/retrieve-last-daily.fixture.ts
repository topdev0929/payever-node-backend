import { fixture, combineFixtures, BaseFixture } from '@pe/cucumber-sdk';
import { Type } from '@nestjs/common';

import { businessFactory } from '../../factories/business.factory';
import { campaignFactory } from '../../factories/campaign.factory';
import { channelSetFactory } from '../../factories/channel-set.factory';

import { BusinessModel } from '../../../../src/business/models';
import { CampaignModel } from '../../../../src/apps/marketing-app/models';
import { ChannelSetModel } from '../../../../src/statistics/models';

const someBusinessId: string = '249f604f-624c-4268-bf49-4a8462b6d7b0';
const someChannelSetId: string = '04bf4923-1113-4f06-92bf-1f917e15b245';

const businessFixture: Type<BaseFixture> = fixture<BusinessModel>('BusinessModel', businessFactory, [
  {
    _id: someBusinessId,
  },
]);

const channelSetFixture: Type<BaseFixture> = fixture<ChannelSetModel>('ChannelSetModel', channelSetFactory, [
  {
    _id: someChannelSetId,
    businessId: someBusinessId,
  },
]);

const campaignFixture: Type<BaseFixture> = fixture<CampaignModel>('CampaignModel', campaignFactory, [
  {
    _id: '6695dd72-5dba-4b8c-820f-0f944e42c801',
    businessId: someBusinessId,
    channelSet: someChannelSetId,
    createdAt: '2019-06-24T16:00:00.000Z',
  },
  {
    _id: '611ca64b-9831-4c12-9c6d-38d8290c8e9d',
    businessId: someBusinessId,
    channelSet: someChannelSetId,
    createdAt: '2019-06-24T16:01:00.000Z',
  },
  {
    _id: '478fd956-fe8e-4b4d-8175-a0bb3ffaedaa',
    businessId: someBusinessId,
    channelSet: someChannelSetId,
    createdAt: '2019-06-24T16:02:00.000Z',
  },
]);

export = combineFixtures(businessFixture, channelSetFixture, campaignFixture);
