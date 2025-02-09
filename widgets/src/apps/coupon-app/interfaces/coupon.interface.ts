import { CouponsStatusEnum, CouponTypeEnum } from '../enums';

export interface CouponInterface {
  businessId: string;
  code: string;
  description: string;
  endDate: Date;
  isAutomaticDiscount: boolean;
  name: string;
  startDate: Date;
  status: CouponsStatusEnum;
  type: CouponTypeEnum;
}
