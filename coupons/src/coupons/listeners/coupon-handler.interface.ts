import { DocumentDefinition } from 'mongoose';
import { ApplyCouponDto } from '../dto';
import { ApplyCouponResponseInterface } from '../interfaces';
import { Coupon, CouponDocument, CouponType, CouponTypeEmbeddedDocument } from '../schemas';

export interface CouponHandlerInterface<
  C extends CouponType = CouponType,
  D extends CouponTypeEmbeddedDocument = CouponTypeEmbeddedDocument,
> {
  isHandlerFor(coupon: Coupon): boolean;
  create(data: DocumentDefinition<Coupon<C>>): Promise<CouponDocument<D>>;
  applyCoupon(coupon: Coupon<C>, dto: ApplyCouponDto, couponId: string): Promise<ApplyCouponResponseInterface>;
}
