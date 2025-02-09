
import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';
import { BusinessModel } from '../../../../src/business';
import { ChannelSetModel } from '../../../../src/statistics';
import { ChannelSetMonthAmountModel } from '../../../../src/transactions-app';
import { businessFactory } from '../../factories/business.factory';
import { channelSetFactory } from '../../factories/channel-set.factory';
import { channelSetDateRevenueFactory } from '../../factories/date-revenue.factory';

const businessId: string = '1ad81b43-174f-4549-b776-228cf4be9bd1';
const channelSetId: string = '9e9dd289-758c-44a2-9a24-8443b049aeef';

type FormatDateType = (m: moment.Moment) => string;
const formatDate: FormatDateType = (m: moment.Moment) => m.format('YYYY-MM');

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    {
      _id: businessId,
    },
  ]),

  fixture<ChannelSetModel>('ChannelSetModel', channelSetFactory, [
    {
      _id: channelSetId,
      businessId: businessId,
    },
  ]),

  fixture<ChannelSetMonthAmountModel>('ChannelSetMonthAmountModel', channelSetDateRevenueFactory, [
    {
      amount: 400,
      channelSet: channelSetId,
      date: formatDate(moment()),
    },
    {
      amount: 1000,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(1, 'month')),
    },
    {
      amount: 200,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(21, 'month')),
    },
    {
      amount: 500,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(3, 'months')),
    },
    {
      amount: 250,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(4, 'months')),
    },
  ]),
);
