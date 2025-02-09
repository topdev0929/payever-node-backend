import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator, PartialFactory } from '@pe/cucumber-sdk';
import { BusinessModel } from '../../../src/statistics';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultBusinessFactory: () => BusinessModel = (): BusinessModel => {
  seq.next();

  return ({
    _id: uuid.v4(),
    name: `Business_${seq.current}`,
    currency: 'EUR',
    owner: 'ooooo-ooo-ooo-oooooo-oo',
  } as any);
};

export const businessFactory: PartialFactory<BusinessModel> = partialFactory(defaultBusinessFactory);
