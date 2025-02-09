import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { CheckoutMetricsInterface } from '../../src/checkout-analytics/interfaces';

type CheckoutMetricsType = CheckoutMetricsInterface & { _id: string };

const LocalFactory: DefaultFactory<CheckoutMetricsType> = (): CheckoutMetricsType => {
  return {
    _id: uuid.v4(),
    paymentFlowId: '855fa0b785513426f76d6ade94c4f0c9',
    paymentMethod: 'test_payment_method',
  } as CheckoutMetricsType;
};

export class CheckoutMetricsFactory {
  public static create: PartialFactory<any> = partialFactory<CheckoutMetricsType>(LocalFactory);
}
