import * as uuid from 'uuid';

import { DocumentDefinition } from 'mongoose';

import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import { CouponDocument } from '../../src/coupons/schemas';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultFactory: () => DocumentDefinition<CouponDocument> = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    code: 'FIXED5',
  } as any;
};

export const couponsFactory: PartialFactory<DocumentDefinition<CouponDocument>> = partialFactory(defaultFactory);
