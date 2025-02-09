import 'mocha';
import {
  ExpectedMessageDto,
  asyncConsumerChecker,
  PePact,
} from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { RabbitMessagesEnum } from '../../../src/enum';
import {
  CheckoutLinkedDto,
  CheckoutSettingUpdateDto,
  PaymentPayloadDto,
} from '../../../src/dto';
import { ProvidersEnum } from '../config';

const EMAIL_FORMAT: string =
  '^([\\w+\\-].?)+@[a-z\\d\\-]+(\\.[a-z]+)*\\.[a-z]{2,}$';
const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      channelSetId: Matchers.uuid(),
      checkoutId: Matchers.uuid(),
    },
    dtoClass: CheckoutLinkedDto,
    name: RabbitMessagesEnum.CheckoutChannelSetLinked,
  },
  {
    contentMatcher: {
      checkoutId: Matchers.uuid(),
      settings: {
        message: Matchers.like('hello world'),
        phoneNumber: Matchers.like('123456'),
        keyword: Matchers.like('default'),
      },
    },
    dtoClass: CheckoutSettingUpdateDto,
    name: 'checkout.event.checkout.created',
  },
  {
    contentMatcher: {
      checkoutId: Matchers.uuid(),
      settings: {
        message: Matchers.like('hello world'),
        phoneNumber: Matchers.like('123456'),
        keyword: Matchers.like('default'),
      },
    },
    dtoClass: CheckoutSettingUpdateDto,
    name: 'checkout.event.checkout.updated',
  },
  {
    contentMatcher: {
      payment: {
        id: Matchers.uuid(),
        uuid: Matchers.uuid(),
        total: Matchers.like(12.23),
        payment_type: Matchers.like('cash'),
        addres: {
          first_name: Matchers.like('Narayan'),
          last_name: Matchers.like('Ghimire'),
          email: Matchers.regex({
            generate: 'hello1@payever.or',
            matcher: EMAIL_FORMAT,
          }),
          country: Matchers.like('Nepal'),
          zip_code: Matchers.like('28759'),
          street: Matchers.like('RodingsMarkt'),
          phone: Matchers.like('0123456789'),
        },
      },
      payment_flow: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: PaymentPayloadDto,
    name: 'checkout.event.payment.created',
  },
  {
    contentMatcher: {
      payment: {
        id: Matchers.uuid(),
        uuid: Matchers.uuid(),
        total: Matchers.like(12.23),
        payment_type: Matchers.like('cash'),
        addres: {
          first_name: Matchers.like('Narayan'),
          last_name: Matchers.like('Ghimire'),
          email: Matchers.regex({
            generate: 'hello1@payever.or',
            matcher: EMAIL_FORMAT,
          }),
          country: Matchers.like('Nepal'),
          zip_code: Matchers.like('28759'),
          street: Matchers.like('RodingsMarkt'),
          phone: Matchers.like('0123456789'),
        },
      },
      payment_flow: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: PaymentPayloadDto,
    name: 'checkout.event.payment.updated',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Checkout);

describe('Receive checkout messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
