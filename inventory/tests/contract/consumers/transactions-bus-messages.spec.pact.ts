import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import 'mocha';
import {
  CheckoutFlowMessageDto,
  CheckoutPaymentMessageDto,
} from '../../../src/inventory/dto/checkout';
import { CheckoutPaymentStatusEnum } from '../../../src/inventory/enums';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      flow: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutFlowMessageDto,
    name: 'checkout.event.payment-flow.created no cart',
  },
  {
    contentMatcher: {
      flow: {
        cart: {
          items: Matchers.eachLike({
            id: Matchers.like('some product id'),
            identifier: Matchers.like('some_sku'),
            product_uuid: Matchers.uuid(),
            quantity: Matchers.like(10),
          }),
        },
        id: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutFlowMessageDto,
    name: 'checkout.event.payment-flow.created with cart no order',
  },
  {
    contentMatcher: {
      flow: {
        cart: {
          items: Matchers.eachLike({
            id: Matchers.like('some product id'),
            identifier: Matchers.like('some_sku'),
            product_uuid: Matchers.uuid(),
            quantity: Matchers.like(10),
          }),
          order: Matchers.uuid(),
        },
        id: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutFlowMessageDto,
    name: 'checkout.event.payment-flow.created with cart and order',
  },
  {
    contentMatcher: {
      flow: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutFlowMessageDto,
    name: 'checkout.event.payment-flow.updated no cart',
  },
  {
    contentMatcher: {
      flow: {
        cart: {
          items: Matchers.eachLike({
            id: Matchers.like('some product id'),
            identifier: Matchers.like('some_sku'),
            product_uuid: Matchers.uuid(),
            quantity: Matchers.like(10),
          }),
        },
        id: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutFlowMessageDto,
    name: 'checkout.event.payment-flow.updated with cart no order',
  },
  {
    contentMatcher: {
      flow: {
        cart: {
          items: Matchers.eachLike({
            id: Matchers.like('some product id'),
            identifier: Matchers.like('some_sku'),
            product_uuid: Matchers.uuid(),
            quantity: Matchers.like(10),
          }),
          order: Matchers.uuid(),
        },
        id: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutFlowMessageDto,
    name: 'checkout.event.payment-flow.updated with cart and order',
  },
  {
    contentMatcher: {
      payment: {
        payment_flow: {
          id: Matchers.uuid(),
        },
        uuid: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutPaymentMessageDto,
    name: 'checkout.event.payment.created',
  },
  {
    contentMatcher: {
      payment: {
        payment_flow: {
          id: Matchers.uuid(),
        },
        status: Matchers.like(CheckoutPaymentStatusEnum.STATUS_ACCEPTED),
        uuid: Matchers.uuid(),
      },
    },
    dtoClass: CheckoutPaymentMessageDto,
    name: 'checkout.event.payment.updated',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.CheckoutPhp
);

describe('Receive transactions bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
