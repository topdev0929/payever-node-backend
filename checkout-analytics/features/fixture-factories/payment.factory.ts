import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { PaymentInterface } from '../../src/checkout-analytics/interfaces';

type PaymentType = PaymentInterface & { _id: string };

const LocalFactory: DefaultFactory<PaymentType> = (): PaymentType => {
  return {
    _id: uuid.v4(),
  } as PaymentType;
};

export class PaymentFactory {
  public static create: PartialFactory<any> = partialFactory<PaymentType>(LocalFactory);
}
