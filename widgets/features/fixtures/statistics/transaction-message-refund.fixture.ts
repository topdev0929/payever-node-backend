
import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';
import { BusinessModel } from '../../../src/business';
import { ChannelSetModel, TransactionModel } from '../../../src/statistics';
import { ChannelSetMonthAmountModel, BusinessMonthAmountModel } from '../../../src/apps/transactions-app';
import { businessFactory } from '../factories/business.factory';
import { channelSetFactory } from '../factories/channel-set.factory';
import { transactionFactory } from '../factories/transaction.factory';
import { channelSetDateRevenueFactory, businessDateRevenueFactory } from '../factories/date-revenue.factory';

const businessId: string = '1ad81b43-174f-4549-b776-228cf4be9bd1';
const channelSetId: string = '9e9dd289-758c-44a2-9a24-8443b049aeef';
const transactionId: string = 'e0a808f4-af26-48e5-bb17-8fe083d94dd8';

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
    },
  ]),

  fixture<TransactionModel>('TransactionModel', transactionFactory, [
    {
      _id: transactionId,
    },
  ]),

  fixture<ChannelSetMonthAmountModel>('ChannelSetMonthAmountModel', channelSetDateRevenueFactory, [
    {
      amount: 300,
      channelSet: channelSetId,
      date: formatDate(moment()),
    },
    {
      amount: 200,
      channelSet: channelSetId,
      date: formatDate(moment().subtract(1, 'month')),
    },
  ]),

  fixture<BusinessMonthAmountModel>('BusinessMonthAmountModel', businessDateRevenueFactory, [
    {
      amount: 300,
      businessId: businessId,
      date: formatDate(moment()),
    },
    {
      amount: 200,
      businessId: businessId,
      date: formatDate(moment().subtract(1, 'month')),
    },
  ]),
);
