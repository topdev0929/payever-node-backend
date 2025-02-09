import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { CheckoutIntegrationSubInterface } from '../../src/checkout/interfaces';

const seq: SequenceGenerator = new SequenceGenerator(1);

type CheckoutIntegrationSubType = CheckoutIntegrationSubInterface & { _id: string };

const LocalFactory: DefaultFactory<CheckoutIntegrationSubType> = (): any => {
  seq.next();

  return {
    _id: uuid.v4(),
    installed: false,
  };
};

export class CheckoutIntegrationSubFactory {
  public static create: PartialFactory<CheckoutIntegrationSubType> =
    partialFactory<CheckoutIntegrationSubType>(LocalFactory);
}
