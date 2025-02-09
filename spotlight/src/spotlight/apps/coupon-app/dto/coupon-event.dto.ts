import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CouponDto } from './coupon.dto';

export class CouponEventDto {
  @Type(() => CouponDto)
  @ValidateNested()
  public coupon: CouponDto;
}
