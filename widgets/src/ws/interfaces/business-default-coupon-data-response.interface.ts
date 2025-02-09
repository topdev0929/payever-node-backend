import { CouponInterface } from '../../apps/coupon-app';
import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultCouponDataResponseInterface extends MessageResponseInterface {
  id: string;
  coupon?: CouponInterface;
}
