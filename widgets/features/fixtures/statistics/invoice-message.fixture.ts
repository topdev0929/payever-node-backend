import { v4 as uuid } from 'uuid';
import { combineFixtures, fixture } from '@pe/cucumber-sdk';
import * as moment from 'moment';
import { BusinessModel } from '../../../src/business';
import { ChannelSetModel, InvoiceModel } from '../../../src/statistics';
import {
  BusinessMonthAmountModel,
} from '../../../src/apps/invoice-app';
import { businessFactory } from '../factories/business.factory';
import { channelSetFactory } from '../factories/channel-set.factory';
import {
  businessDateRevenueFactory,
} from '../factories/date-revenue.factory';
import { invoiceFactory, userFactory } from '../factories';
import { UserModel } from '../../../src/user';

const businessId: string = '1ad81b43-174f-4549-b776-228cf4be9bd1';
const userId: string = '333cc7fc-eb5e-47b6-8e1a-0bfa7b9fb8fe';
const channelSetId: string = '9e9dd289-758c-44a2-9a24-8443b049aeef';

type FormatDateType = (m: moment.Moment) => string;
const formatDate: FormatDateType = (m: moment.Moment) => m.format('YYYY-MM');

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    {
      _id: businessId,
    },
  ]),

  fixture<UserModel>('UserModel', userFactory, [
    {
      _id: userId,
    },
  ]),

  fixture<ChannelSetModel>('ChannelSetModel', channelSetFactory, [
    {
      _id: channelSetId,
    },
  ]),

  fixture<BusinessMonthAmountModel>('InvoiceBusinessMonthAmountModel', businessDateRevenueFactory, [
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

  fixture<InvoiceModel>('InvoiceModel', invoiceFactory, [
    {
      _id: 'invoiceId-1',
      amountPaid: 300,
      currency: 'EUR',
    },
  ]),
);
