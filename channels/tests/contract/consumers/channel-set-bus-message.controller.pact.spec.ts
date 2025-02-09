import { ExpectedMessageDto, PePact, asyncConsumerChecker } from "@pe/pact-kit";
import { ProvidersEnum } from "../config";
import { CheckoutDto } from "@pe/channels-sdk";
import { Matchers } from '@pact-foundation/pact';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      checkoutId: Matchers.uuid()
    },
    dtoClass: CheckoutDto,
    name: 'checkout.event.checkout.created',
  },
];

const messagePactCheckout = PePact.getMessageConsumer(ProvidersEnum.Checkout)

describe('Receive channel set bus messages', () => {
    for (const message of messages) {
      it(`Accepts valid "${message.name}" messages`, () => {
    		return asyncConsumerChecker(messagePactCheckout, message);
    	});
    }
})
