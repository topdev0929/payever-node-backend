import { Schema, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { couponTypeSchemaOptions } from '../../const/const';
import { CouponTypeAppliedToEnum, CouponTypeEnum, CouponTypeMinimumRequirementsEnum } from '../../enum';
import { CouponType, CouponTypeEmbeddedDocument } from '../coupon-type.schema';
import { Coupon, CouponDocument } from '../coupon.schema';

@SchemaDecorator(couponTypeSchemaOptions)
export class CouponTypePercentage extends CouponType {
  @Prop({ enum: CouponTypeAppliedToEnum, type: String })
  public appliesTo: CouponTypeAppliedToEnum;

  @Prop({ type: [String] })
  public appliesToCategories: string[];

  @Prop({ type: [String] })
  public appliesToProducts: string[];

  @Prop()
  public discountValue: number;

  @Prop({ enum: CouponTypeMinimumRequirementsEnum, type: String })
  public minimumRequirements: CouponTypeMinimumRequirementsEnum;

  @Prop()
  public minimumRequirementsPurchaseAmount?: number;

  @Prop()
  public minimumRequirementsQuantityOfItems?: number;

  public type: CouponTypeEnum.PERCENTAGE;

  public static isCouponTypeOf(coupon: Coupon): coupon is Coupon<CouponTypePercentage> {
    return coupon.type.type === CouponTypeEnum.PERCENTAGE;
  }
}

export type CouponTypePercentageInterface = CouponTypePercentage;

export interface CouponTypePercentageEmbeddedDocument extends CouponTypeEmbeddedDocument, CouponTypePercentage {
  _id?: never;
  type: CouponTypeEnum.PERCENTAGE;
}

export const CouponTypePercentageSchema: Schema<CouponTypePercentageEmbeddedDocument> =
  SchemaFactory.createForClass(CouponTypePercentage);
