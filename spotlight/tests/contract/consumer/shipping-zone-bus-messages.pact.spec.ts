import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ShippingZoneEventDto } from '../../../src/spotlight/apps/shipping-app/dto';
import { ShippingZoneRabbitEventsEnum } from '../../../src/spotlight/apps/shipping-app/enums';
import { ProvidersEnum } from '../config';

const shippingZoneEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  businessId: Matchers.uuid(),
  countryCodes: Matchers.eachLike(Matchers.string()),
  deliveryTimeDays: Matchers.integer()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: shippingZoneEventMatcher,
    dtoClass: ShippingZoneEventDto,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneCreated,
  },
  {
    contentMatcher: shippingZoneEventMatcher,
    dtoClass: ShippingZoneEventDto,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneUpdated,
  },
  {
    contentMatcher: shippingZoneEventMatcher,
    dtoClass: ShippingZoneEventDto,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneExported,
  },
  {
    contentMatcher: shippingZoneEventMatcher,
    dtoClass: ShippingZoneEventDto,
    name: ShippingZoneRabbitEventsEnum.ShippingZoneRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Shipping);

describe('Receive shipping zone bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
