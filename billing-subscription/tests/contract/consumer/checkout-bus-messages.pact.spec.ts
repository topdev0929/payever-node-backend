import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitBinding } from '../../../src/environments';
import { CheckoutPaymentRmqMessageDto } from '../../../src/subscriptions/dto';
import { ProvidersEnum } from '../config';

const paymentCreatedMessageMatcher = {
  payment: {
    uuid: Matchers.uuid(),
    user_uuid: Matchers.uuid(),
    business: {
      uuid: Matchers.uuid()
    },
    items: Matchers.eachLike({
      identifier: Matchers.string(),
      extra_data: {
        subscriptionPlan: Matchers.string(),
        subscriptionId: Matchers.uuid()
      }
    }),
    customer_email: Matchers.string(),
    customer_name: Matchers.string(),
    reference: Matchers.string()
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: paymentCreatedMessageMatcher,
    dtoClass: CheckoutPaymentRmqMessageDto,
    name: RabbitBinding.PaymentCreated,
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
