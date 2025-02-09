
import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';
import { BusinessModel } from '../../../../src/business';
import { ChannelSetModel } from '../../../../src/statistics';
import { ChannelSetDayAmountModel } from '../../../../src/transactions-app';
import { businessFactory } from '../../factories/business.factory';
import { channelSetFactory } from '../../factories/channel-set.factory';
import { channelSetDateRevenueFactory } from '../../factories/date-revenue.factory';

const businessId: string = '1ad81b43-174f-4549-b776-228cf4be9bd1';
const channelSetId: string = '9e9dd289-758c-44a2-9a24-8443b049aeef';

type FormatDateType = (m: moment.Moment) => string;
const formatDate: FormatDateType = (m: moment.Moment) => m.format('YYYY-MM-DD');

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

  fixture<ChannelSetDayAmountModel>('ChannelSetDayAmountModel', channelSetDateRevenueFactory, [
    {
      amount: 40,
      channelSet: channelSetId,
      date: formatDate(moment()),
    },
    {
      amount: 100,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(1, 'day')),
    },
    {
      amount: 20,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(2, 'days')),
    },
    {
      amount: 50,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(3, 'days')),
    },
    {
      amount: 25,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(40, 'days')),
    },
  ]),
);
