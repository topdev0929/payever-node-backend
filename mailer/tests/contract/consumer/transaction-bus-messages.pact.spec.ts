import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { PaymentMailDto } from '../../../src/mailer/dto/payment';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      business: {
        uuid: Matchers.uuid(),
      },
      payment: {
        address: Matchers.like('some address'),
        amount: Matchers.like('some ammount'),
        created_at: Matchers.iso8601DateTime(),
        currency: Matchers.like('some currency'),
        customer_email: Matchers.term({
          generate: 'something@somewhere.com',
          matcher: '[^@]+@[^.]+..+',
        }),
        customer_name: Matchers.like('some name'),
        delivery_fee: Matchers.like('some fee'),
        id: Matchers.uuid(),
        payment_option: Matchers.like('some option methon'),
        reference: Matchers.like('some reference'),
        total: Matchers.like('some total'),
        uuid: Matchers.uuid(),
        vat_rate: Matchers.like('some rate'),
      },
      payment_items: Matchers.eachLike({
        name: Matchers.like('some item name'),
        options: Matchers.eachLike({
          name: Matchers.like('some item option name'),
          value: Matchers.like('some item option value'),
        }),
        price: Matchers.like('some item price'),
        quantity: Matchers.like('some item quantity'),
        thumbnail: Matchers.like('some item thumbnail'),
        uuid: Matchers.uuid(),
        vat_rate: Matchers.like('some item vat rate'),
      }),
      template_name: 'order_invoice_template',
      to: Matchers.like('some to address'),
    },
    dtoClass: PaymentMailDto,
    name: 'payever.event.payment.email.order_invoice_template',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      business: {
        uuid: Matchers.uuid(),
      },
      payment: {
        address: Matchers.like('some address'),
        amount: Matchers.like('some ammount'),
        created_at: Matchers.iso8601DateTime(),
        currency: Matchers.like('some currency'),
        customer_email: Matchers.term({
          generate: 'something@somewhere.com',
          matcher: '[^@]+@[^.]+..+',
        }),
        customer_name: Matchers.like('some name'),
        delivery_fee: Matchers.like('some fee'),
        id: Matchers.uuid(),
        payment_option: Matchers.like('some option methon'),
        reference: Matchers.like('some reference'),
        total: Matchers.like('some total'),
        uuid: Matchers.uuid(),
        vat_rate: Matchers.like('some rate'),
      },
      payment_items: Matchers.eachLike({
        name: Matchers.like('some item name'),
        options: Matchers.eachLike({
          name: Matchers.like('some item option name'),
          value: Matchers.like('some item option value'),
        }),
        price: Matchers.like('some item price'),
        quantity: Matchers.like('some item quantity'),
        thumbnail: Matchers.like('some item thumbnail'),
        uuid: Matchers.uuid(),
        vat_rate: Matchers.like('some item vat rate'),
      }),
      template_name: 'shipping_order_template',
      to: Matchers.like('some to address'),
      variables: {
        deliveryDate: Matchers.iso8601DateTime(),
        trackingNumber: Matchers.like('some tracking number'),
        trackingUrl: Matchers.term({
          generate: `http://www.example.com/some/url`,
          matcher: `http[s]*://[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+[/?.:=&a-zA-Z0-9_-]+`,
        }),
      },
    },
    dtoClass: PaymentMailDto,
    name: 'payever.event.payment.email.shipping_order_template',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Transaction,
);

describe('Receive transaction bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
