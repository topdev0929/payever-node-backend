import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { BusinessInterface } from '../../src/business/interfaces';

const seq: SequenceGenerator = new SequenceGenerator(1);

type BusinessType = BusinessInterface & { _id: string };

const LocalFactory: DefaultFactory<BusinessType> = (): BusinessType => {
  seq.next();

  return {
    _id: uuid.v4(),
    channelSets: [],
    checkouts: [],
    currency: 'EUR',
    name: `Business ${seq.current}`,
  };
};

export class BusinessFactory {
  public static create: PartialFactory<BusinessType> = partialFactory<BusinessType>(LocalFactory);
}
