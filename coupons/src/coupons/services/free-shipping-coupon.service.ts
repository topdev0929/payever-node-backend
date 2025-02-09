import { Model, DocumentDefinition } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceTag } from '@pe/nest-kit';

import { ApplyCouponDto } from '../dto';
import { CouponTypeEnum, CouponTypeFreeShippingTypeEnum, CouponTypeMinimumRequirementsEnum } from '../enum';
import { ApplyCouponResponseInterface, CartItemInterface } from '../interfaces';
import { CouponHandlerInterface } from '../listeners';
import {
  Coupon,
  CouponDocument,
  CouponInterface,
  CouponSchemaName,
  CouponTypeFreeShipping,
  CouponTypeFreeShippingEmbeddedDocument,
} from '../schemas';
import { BaseCouponService } from './base-coupon.service';

@Injectable()
@ServiceTag('CouponTypeService')
export class FreeShippingCouponService
  extends BaseCouponService
  implements CouponHandlerInterface<CouponTypeFreeShipping, CouponTypeFreeShippingEmbeddedDocument> {
  @InjectModel(CouponSchemaName)
    protected readonly couponModel: Model<CouponDocument<CouponTypeFreeShippingEmbeddedDocument>>;
  public isHandlerFor(coupon: Coupon): boolean {
    return coupon.type.type === CouponTypeEnum.FREE_SHIPPING;
  }

  public create(
    data: DocumentDefinition<CouponDocument<CouponTypeFreeShippingEmbeddedDocument>>,
  ): Promise<CouponDocument<CouponTypeFreeShippingEmbeddedDocument>> {
    return this.couponModel.create(data);
  }

  public async applyCoupon(
    coupon: CouponInterface<CouponTypeFreeShipping>,
    dto: ApplyCouponDto,
    couponId: string,
  ): Promise<ApplyCouponResponseInterface> {

    if (coupon.type.freeShippingType ===  CouponTypeFreeShippingTypeEnum.SELECTED_COUNTRIES) {
      const isAllowed: boolean = coupon.type.freeShippingToCountries.includes(dto.shippingCountry);

      if (!isAllowed) {
        throw new BadRequestException({
          message: `Country not allowed`,
        });
      }
    }

    const totalCartAmount: number = dto.cart.reduce((amount: number, item: CartItemInterface) => {
      return item.quantity * item.price + amount;
    }, 0);

    if (coupon.type.minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT) {
      const isAllowed: boolean = totalCartAmount >= coupon.type.minimumRequirementsPurchaseAmount;

      if (!isAllowed) {
        throw new BadRequestException({
          message: `Below minimum purchase amount`,
        });
      }
    }

    if (coupon.type.minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS) {
      const isAllowed: boolean = dto.cart.length >= coupon.type.minimumRequirementsQuantityOfItems;

      if (!isAllowed) {
        throw new BadRequestException({
          message: `Below minimum quantity of items`,
        });
      }
    }

    if (coupon.type.excludeShippingRatesOverCertainAmount) {
      const isAllowed: boolean = totalCartAmount >= coupon.type.excludeShippingRatesOverCertainAmountValue;

      if (!isAllowed) {
        throw new BadRequestException({
          message: 'Below minimum purchase amount',
        });
      }
    }

    await this.couponUsedService.addUsage(couponId, dto.customerEmail);

    return {
      cart: dto.cart,
      freeShipping: true,
    };
  }
}
