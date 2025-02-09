import * as moment from 'moment';

import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import { UserMonthAmountModel } from '../../../../src/transactions-app';
import { UserModel } from '../../../../src/user/models';
import { userDateRevenueFactory } from '../../factories/date-revenue.factory';
import { userFactory } from '../../factories/user.factory';

const someUserId: string = '525591f7-740a-4849-9f7e-e4e7b7a9af1a';

type FormatDateType = (m: moment.Moment) => string;
const formatDate: FormatDateType = (m: moment.Moment) => m.format('YYYY-MM-DD');

export = combineFixtures(
  fixture<UserModel>('UserModel', userFactory, [
    { _id: someUserId },
  ]),

  fixture<UserMonthAmountModel>('UserMonthAmountModel', userDateRevenueFactory, [
    {
      amount: 1000,
      date: formatDate(moment()),
      user: someUserId,
    },
    {
      amount: 6000,
      date: formatDate(moment().subtract(1, 'month')),
      user: someUserId,
    },
    {
      amount: 2400,
      date: formatDate(moment().subtract(2, 'months')),
      user: someUserId,
    },
    {
      amount: 3000,
      date: formatDate(moment().subtract(3, 'months')),
      user: someUserId,
    },
    {
      amount: 1500,
      date: formatDate(moment().subtract(4, 'months')),
      user: someUserId,
    },
  ]),
);
