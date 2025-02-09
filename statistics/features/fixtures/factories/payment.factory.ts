import { v4 as uuid } from 'uuid';
import { DocumentDefinition } from 'mongoose';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

import { PaymentModel } from '../../../src/etl/models';
import { PaymentItemInterface } from '../../../src/etl/interfaces';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultPaymentFactory: () => DocumentDefinition<PaymentModel> = () => {
  seq.next();

  return {
    _id: uuid(),
    amount: seq.current,
    channel: 'whatsapp',
    currency: 'EUR',
    originalId: `bfe5b6ce-3b43-4f66-9629-${String(seq.current).padStart(12, '0')}`,
    paymentMethod: 'paypal',
    reference: uuid(),
    status: 'paid',
    total: seq.current * 10,
    userId:'12345645645',
    createdAt: seq.currentDate,
    updatedAt: seq.currentDate,
  };
};

export const paymentFactory: PartialFactory<DocumentDefinition<PaymentModel>> = partialFactory(defaultPaymentFactory);

const PaymentItemFactory: () => PaymentItemInterface = () => {
  seq.next();

  return {
    createdAt: seq.currentDate,
    name: `item-name-${seq.current}`,
    price: 200 + seq.current,
    quantity: 1 + seq.current,
  };
};

export const paymentItemFactory: PartialFactory<PaymentItemInterface> = partialFactory(PaymentItemFactory);
