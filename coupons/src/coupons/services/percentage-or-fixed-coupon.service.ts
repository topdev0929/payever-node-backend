/* eslint-disable max-classes-per-file */
import { Model, DocumentDefinition } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceTag } from '@pe/nest-kit';

import { ApplyCouponDto } from '../dto';
import { CouponTypeEnum } from '../enum';
import { ApplyCouponResponseInterface, CartItemInterface } from '../interfaces';
import { CouponHandlerInterface } from '../listeners';
import {
  Coupon,
  CouponDocument,
  CouponInterface,
  CouponSchemaName,
  CouponsTypeFixedAmountEmbeddedDocument,
  CouponType,
  CouponTypeFixedAmountInterface,
  CouponTypePercentageEmbeddedDocument,
  CouponTypePercentageInterface,
} from '../schemas';
import { BaseCouponService } from './base-coupon.service';

abstract class PercentageOrFixedCouponService extends BaseCouponService {
  public async applyCoupon(
    coupon: CouponInterface<CouponTypePercentageInterface> | CouponInterface<CouponTypeFixedAmountInterface>,
    dto: ApplyCouponDto,
    couponId: string,
  ): Promise<ApplyCouponResponseInterface> {

    const filteredCart: CartItemInterface[] = await this.filterCart(
      coupon,
      dto.cart,
    );

    const appliedOn: ApplyCouponResponseInterface['appliedOn'] = [];

    const discountItems: CartItemInterface[] = [];

    for (const item of filteredCart) {

      if (coupon.limits.limitUsage && coupon.limits.limitUsageAmount) {
        const usage: number = await this.couponUsedService.getCouponUsageForCustomer(
          couponId,
          dto.customerEmail,
        );

        if (coupon.limits.limitUsageAmount === usage) {
          break;
        }
      }

      const discount: number =
        coupon.type.type === CouponTypeEnum.PERCENTAGE ?
        item.price / 100 * coupon.type.discountValue :
        coupon.type.discountValue;

      item.price = item.price - discount;

      appliedOn.push({
        identifier: item.identifier,
        reduction: discount,
      });

      discountItems.push(item);

      await this.couponUsedService.addUsage(couponId, dto.customerEmail);

      if (coupon.limits.limitUsage && coupon.limits.limitOneUsePerCustomer) {
        break;
      }
    }

    const cartAfterDiscount: CartItemInterface[] = [
      ...dto.cart.filter((item: CartItemInterface) => {
        return discountItems.indexOf(item) === -1;
      }),
      ...discountItems,
    ];

    return {
      appliedOn,
      cart: cartAfterDiscount,
    };
  }
}

@Injectable()
@ServiceTag('CouponTypeService')
export class PercentageCouponService
  extends PercentageOrFixedCouponService
  implements CouponHandlerInterface<CouponTypePercentageInterface, CouponTypePercentageEmbeddedDocument> {

  @InjectModel(CouponSchemaName)
    protected readonly couponModel: Model<CouponDocument<CouponTypePercentageEmbeddedDocument>>;

  public create(
    data: DocumentDefinition<CouponDocument<CouponTypePercentageEmbeddedDocument>>,
  ): Promise<CouponDocument<CouponTypePercentageEmbeddedDocument>> {
    return this.couponModel.create(data);
  }

  public isHandlerFor(coupon: Coupon<CouponType>): boolean {
    return [
      CouponTypeEnum.PERCENTAGE,
    ].includes(coupon.type.type);
  }
}

@Injectable()
@ServiceTag('CouponTypeService')
export class FixedCouponService
  extends PercentageOrFixedCouponService
  implements CouponHandlerInterface<CouponTypeFixedAmountInterface, CouponsTypeFixedAmountEmbeddedDocument> {

  @InjectModel(CouponSchemaName)
    protected readonly couponModel: Model<CouponDocument<CouponsTypeFixedAmountEmbeddedDocument>>;

  public create(
    data: DocumentDefinition<CouponDocument<CouponsTypeFixedAmountEmbeddedDocument>>,
  ): Promise<CouponDocument<CouponsTypeFixedAmountEmbeddedDocument>> {
    return this.couponModel.create(data);
  }
  public isHandlerFor(coupon: Coupon<CouponType>): boolean {
    return [
      CouponTypeEnum.FIXED_AMOUNT,
    ].includes(coupon.type.type);
  }
}
