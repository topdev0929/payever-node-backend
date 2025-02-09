import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import { CouponUsedSchemaName, CouponUsedDocument } from '../../src/coupons/schemas';
import { couponsFactory } from '../factories/coupons-factory';

export = fixture<CouponUsedDocument>(getModelToken(CouponUsedSchemaName), couponsFactory as any, [
  {
    coupon: 'limit-one-use-per-customer',
    email: 'test@gmail.com',
  },
  {
    coupon: 'limit-usage-amount',
    email: 'test1@gmail.com',
  },
  {
    coupon: 'limit-usage-amount',
    email: 'test2@gmail.com',
  },
]);
