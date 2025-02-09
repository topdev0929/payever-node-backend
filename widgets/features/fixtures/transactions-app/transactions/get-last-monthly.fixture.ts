
import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';
import { BusinessModel } from '../../../../src/business';
import { BusinessMonthAmountModel } from '../../../../src/transactions-app';
import { businessFactory } from '../../factories/business.factory';
import { businessDateRevenueFactory } from '../../factories/date-revenue.factory';

const businessId: string = '1ad81b43-174f-4549-b776-228cf4be9bd1';

type FormatDateType = (m: moment.Moment) => string;
const formatDate: FormatDateType = (m: moment.Moment) => m.format('YYYY-MM');

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    {
      _id: businessId,
    },
  ]),

  fixture<BusinessMonthAmountModel>('BusinessMonthAmountModel', businessDateRevenueFactory, [
    {
      amount: 800,
      businessId: businessId,
      date: formatDate(moment()),
    },
    {
      amount: 2000,
      businessId: businessId,
      date: formatDate(moment().subtract(1, 'month')),
    },
    {
      amount: 400,
      businessId: businessId,
      date: formatDate(moment().subtract(21, 'month')),
    },
    {
      amount: 1000,
      businessId: businessId,
      date: formatDate(moment().subtract(3, 'months')),
    },
    {
      amount: 500,
      businessId: businessId,
      date: formatDate(moment().subtract(4, 'months')),
    },
  ]),
);
