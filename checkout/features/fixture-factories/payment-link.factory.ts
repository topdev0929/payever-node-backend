import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { PaymentLinkInterface } from '../../src/payment-links/interfaces';
import { PaymentMethodEnum } from '../../src/legacy-api';

type PaymentLinkType = PaymentLinkInterface & { _id: string };

const LocalFactory: DefaultFactory<PaymentLinkType> = (): PaymentLinkType => {
  return {
    _id: uuid.v4(),
    amount: 1000,
    business_id: uuid.v4(),
    currency: 'EUR',
    order_id: 'test_order_id',
    payment_method: PaymentMethodEnum.METHOD_IDEAL,
  };
};

export class PaymentLinkFactory {
  public static create: PartialFactory<PaymentLinkType> = partialFactory<PaymentLinkType>(LocalFactory);
}
