import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { BusinessInterface } from '@pe/business-kit';

const seq: SequenceGenerator = new SequenceGenerator(1);

type BusinessType = BusinessInterface & { _id: string };

const LocalFactory: DefaultFactory<BusinessType> = (): BusinessType => {
  seq.next();

  return {
    _id: uuid.v4(),
    subscriptions: [],
  } as any;
};

export class BusinessFactory {
  public static create: PartialFactory<BusinessType> = partialFactory<BusinessType>(LocalFactory);
}
