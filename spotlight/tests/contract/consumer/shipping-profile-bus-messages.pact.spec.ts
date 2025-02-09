import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ShippingProfileEventDto } from '../../../src/spotlight/apps/shipping-app/dto';
import { ShippingProfileRabbitEventsEnum } from '../../../src/spotlight/apps/shipping-app/enums';
import { ProvidersEnum } from '../config';

const shippingProfileEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  businessId: Matchers.uuid(),
  zones: Matchers.eachLike(Matchers.string())
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: shippingProfileEventMatcher,
    dtoClass: ShippingProfileEventDto,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileCreated,
  },
  {
    contentMatcher: shippingProfileEventMatcher,
    dtoClass: ShippingProfileEventDto,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileUpdated,
  },
  {
    contentMatcher: shippingProfileEventMatcher,
    dtoClass: ShippingProfileEventDto,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileExported,
  },
  {
    contentMatcher: shippingProfileEventMatcher,
    dtoClass: ShippingProfileEventDto,
    name: ShippingProfileRabbitEventsEnum.ShippingProfileRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Shipping);

describe('Receive shipping profile bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
