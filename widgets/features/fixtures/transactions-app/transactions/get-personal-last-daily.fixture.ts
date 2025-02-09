import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';
import { UserDayAmountModel } from '../../../../src/transactions-app';
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

  fixture<UserDayAmountModel>('UserDayAmountModel', userDateRevenueFactory, [
    {
      amount: 600,
      date: formatDate(moment().subtract(1, 'day')),
      user: someUserId,
    },
    {
      amount: 240,
      date: formatDate(moment().subtract(2, 'days')),
      user: someUserId,
    },
    {
      amount: 300,
      date: formatDate(moment().subtract(3, 'days')),
      user: someUserId,
    },
    {
      amount: 150,
      date: formatDate(moment().subtract(40, 'days')),
      user: someUserId,
    },
  ]),
);
