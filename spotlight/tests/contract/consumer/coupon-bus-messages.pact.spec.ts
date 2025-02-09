import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { CouponEventDto } from '../../../src/spotlight/apps/coupon-app/dto';
import { CouponRabbitEventsEnum, CouponsStatusEnum } from '../../../src/spotlight/apps/coupon-app/enums';
import { ProvidersEnum } from '../config';

const couponEventMatcher = {
  coupon: {
    _id: Matchers.uuid(),
    name: Matchers.string(),
    businessId: Matchers.uuid(),
    description: Matchers.string(),
    code: Matchers.string(),
    status: Matchers.term({
      matcher: `${CouponsStatusEnum.ACTIVE}|${CouponsStatusEnum.INACTIVE}`,
      generate: CouponsStatusEnum.ACTIVE,
    })
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: couponEventMatcher,
    dtoClass: CouponEventDto,
    name: CouponRabbitEventsEnum.CouponCreated,
  },
  {
    contentMatcher: couponEventMatcher,
    dtoClass: CouponEventDto,
    name: CouponRabbitEventsEnum.CouponUpdated,
  },
  {
    contentMatcher: couponEventMatcher,
    dtoClass: CouponEventDto,
    name: CouponRabbitEventsEnum.CouponExported,
  },
  {
    contentMatcher: couponEventMatcher,
    dtoClass: CouponEventDto,
    name: CouponRabbitEventsEnum.CouponRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Coupon);

describe('Receive coupon bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
