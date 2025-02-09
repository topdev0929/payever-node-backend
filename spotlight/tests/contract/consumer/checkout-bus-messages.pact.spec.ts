import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { CheckoutEventDto } from '../../../src/spotlight/apps/checkout-app/dto';
import { CheckoutRabbitEventsEnum } from '../../../src/spotlight/apps/checkout-app/enums';
import { ProvidersEnum } from '../config';

const checkoutEventMatcher = {
  checkoutId: Matchers.uuid(),
  businessId: Matchers.uuid(),
  name: Matchers.string(),
  default: Matchers.boolean()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: checkoutEventMatcher,
    dtoClass: CheckoutEventDto,
    name: CheckoutRabbitEventsEnum.CheckoutCreated,
  },
  {
    contentMatcher: checkoutEventMatcher,
    dtoClass: CheckoutEventDto,
    name: CheckoutRabbitEventsEnum.CheckoutUpdated,
  },
  {
    contentMatcher: checkoutEventMatcher,
    dtoClass: CheckoutEventDto,
    name: CheckoutRabbitEventsEnum.CheckoutExport,
  },
  {
    contentMatcher: checkoutEventMatcher,
    dtoClass: CheckoutEventDto,
    name: CheckoutRabbitEventsEnum.CheckoutRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Checkout);

describe('Receive checkout bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
