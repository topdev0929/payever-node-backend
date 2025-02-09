import * as uuid from 'uuid';
import { DocumentDefinition } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { SequenceGenerator, partialFactory, PartialFactory } from '@pe/cucumber-sdk';

import { incrementAndGetSeq } from './helpers';

export const businessDefaultFactory = (seq: SequenceGenerator) => () => ({
  _id: uuid.v4(),
  name: `business ${incrementAndGetSeq(seq)}`,
});

export const businessFactory: PartialFactory<DocumentDefinition<BusinessModel>> =
  partialFactory(businessDefaultFactory(new SequenceGenerator()));
