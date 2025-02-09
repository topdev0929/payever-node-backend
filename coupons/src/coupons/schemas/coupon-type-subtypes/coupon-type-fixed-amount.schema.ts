import { Schema, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { couponTypeSchemaOptions } from '../../const/const';
import { CouponTypeAppliedToEnum, CouponTypeEnum, CouponTypeMinimumRequirementsEnum } from '../../enum';
import { CouponType, CouponTypeEmbeddedDocument } from '../coupon-type.schema';
import { Coupon, CouponDocument } from '../coupon.schema';

@SchemaDecorator(couponTypeSchemaOptions)
export class CouponsTypeFixedAmount extends CouponType {
  @Prop()
  public appliesTo?: CouponTypeAppliedToEnum;

  @Prop({ type: [String] })
  public appliesToCategories?: string[];

  @Prop({ type: [String] })
  public appliesToProducts?: string[];

  @Prop()
  public discountValue: number;

  @Prop({ enum: CouponTypeMinimumRequirementsEnum, type: String })
  public minimumRequirements?: CouponTypeMinimumRequirementsEnum;

  @Prop()
  public minimumRequirementsPurchaseAmount?: number;

  @Prop()
  public minimumRequirementsQuantityOfItems?: number;

  public type: CouponTypeEnum.FIXED_AMOUNT;

  public static isCouponTypeOf(coupon: Coupon): coupon is Coupon<CouponsTypeFixedAmount> {
    return coupon.type.type === CouponTypeEnum.FIXED_AMOUNT;
  }
}

export type CouponTypeFixedAmountInterface = CouponsTypeFixedAmount;
export interface CouponsTypeFixedAmountEmbeddedDocument extends CouponTypeEmbeddedDocument, CouponsTypeFixedAmount {
  _id?: never;

  type: CouponTypeEnum.FIXED_AMOUNT;
}

export const CouponsTypeFixedAmountSchema: Schema<CouponsTypeFixedAmountEmbeddedDocument> =
  SchemaFactory.createForClass(CouponsTypeFixedAmount);
