import * as uuid from 'uuid';
import { SequenceGenerator, partialFactory } from '@pe/cucumber-sdk';
import { incrementAndGetSeq } from './helpers';

export const businessDefaultFactory = (seq: SequenceGenerator) => () => ({
  _id: uuid.v4(),
  name: `business ${incrementAndGetSeq(seq)}`,
});

export const businessFactory = partialFactory(businessDefaultFactory(new SequenceGenerator()));
