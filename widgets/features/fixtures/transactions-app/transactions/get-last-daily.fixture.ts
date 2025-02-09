
import * as moment from 'moment';
import { BusinessModel } from '../../../../src/business';
import { BusinessDayAmountModel } from '../../../../src/transactions-app';
import { businessFactory } from '../../factories/business.factory';
import { businessDateRevenueFactory } from '../../factories/date-revenue.factory';
import { combineFixtures, fixture } from '@pe/cucumber-sdk';

const businessId: string = '1ad81b43-174f-4549-b776-228cf4be9bd1';

type FormatDateType = (m: moment.Moment) => string;
const formatDate: FormatDateType = (m: moment.Moment) => m.format('YYYY-MM-DD');

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    {
      _id: businessId,
    },
  ]),

  fixture<BusinessDayAmountModel>('BusinessDayAmountModel', businessDateRevenueFactory, [
    {
      amount: 40,
      businessId: businessId,
      date: formatDate(moment()),
    },
    {
      amount: 100,
      businessId: businessId,
      date: formatDate(moment().subtract(1, 'day')),
    },
    {
      amount: 20,
      businessId: businessId,
      date: formatDate(moment().subtract(2, 'days')),
    },
    {
      amount: 50,
      businessId: businessId,
      date: formatDate(moment().subtract(3, 'days')),
    },
    {
      amount: 25,
      businessId: businessId,
      date: formatDate(moment().subtract(40, 'days')),
    },
  ]),
);
