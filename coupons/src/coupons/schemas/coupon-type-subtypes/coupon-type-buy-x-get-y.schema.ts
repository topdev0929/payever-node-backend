import { Schema, Document, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import {
    couponTypeSchemaOptions,
} from '../../const/const';
import {
  CouponTypeBuyOrGetXGetYItemTypeEnum,
  CouponTypeBuyXGetYBuyRequirementsTypeEnum,
  CouponTypeBuyXGetYGetDiscountTypesEnum,
  CouponTypeEnum,
} from '../../enum';
import { CouponType } from '../coupon-type.schema';
import { Coupon } from '../coupon.schema';
import { CouponDocument } from '..';

@SchemaDecorator(couponTypeSchemaOptions)
export class CouponTypeBuyXGetY extends CouponType {
  @Prop({ enum: CouponTypeBuyXGetYBuyRequirementsTypeEnum, type: String })
  public buyRequirementType: CouponTypeBuyXGetYBuyRequirementsTypeEnum;

  @Prop()
  public buyQuantity: number;

  @Prop()
  public buyAmount: number;

  @Prop({ enum: CouponTypeBuyOrGetXGetYItemTypeEnum, type: String })
  public buyType: CouponTypeBuyOrGetXGetYItemTypeEnum;

  @Prop({ type: [String] })
  public buyProducts: string[];

  @Prop({
    type: [String],
    // ref: 'Categories',
  })
  public buyCategories: string[];

  @Prop({
    enum: CouponTypeBuyOrGetXGetYItemTypeEnum,
    type: String,
  })
  public getType: CouponTypeBuyOrGetXGetYItemTypeEnum;

  @Prop()
  public getQuantity: number;

  @Prop({
    // ref: 'Categories',
    type: [String],
  })
  public getCategories: string[];

  @Prop({ type: [String] })
  public getProducts: string[];

  @Prop({ enum: CouponTypeBuyXGetYGetDiscountTypesEnum, type: String })
  public getDiscountType: CouponTypeBuyXGetYGetDiscountTypesEnum;

  @Prop()
  public getDiscountValue: number;

  @Prop()
  public maxUsesPerOrder: boolean;

  @Prop()
  public maxUsesPerOrderValue: number;

  public type: CouponTypeEnum.BUY_X_GET_Y;

  public static isCouponTypeOf(coupon: Coupon): coupon is Coupon<CouponTypeBuyXGetY> {
    return coupon.type.type === CouponTypeEnum.BUY_X_GET_Y;
  }
}

export type CouponTypeBuyXGetYInterface = CouponTypeBuyXGetY;

export interface CouponTypeBuyXGetYEmbeddedDocument extends Types.Subdocument, CouponTypeBuyXGetY {
  _id?: never;
}

export const CouponTypeBuyXGetYSchema: Schema<CouponTypeBuyXGetYEmbeddedDocument> =
  SchemaFactory.createForClass(CouponTypeBuyXGetY);
