import { Schema, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { couponTypeSchemaOptions } from '../../const/const';
import { CouponTypeFreeShippingTypeEnum, CouponTypeMinimumRequirementsEnum } from '../../enum';
import { CouponType } from '../coupon-type.schema';

@SchemaDecorator(couponTypeSchemaOptions)
export class CouponTypeFreeShipping extends CouponType {
  @Prop()
  public excludeShippingRatesOverCertainAmount: boolean;

  @Prop()
  public excludeShippingRatesOverCertainAmountValue: number;

  @Prop({ type: [String] })
  public freeShippingToCountries: string[];

  @Prop({ enum: CouponTypeFreeShippingTypeEnum, type: String })
  public freeShippingType: CouponTypeFreeShippingTypeEnum;

  @Prop({ enum: CouponTypeMinimumRequirementsEnum, type: String })
  public minimumRequirements: CouponTypeMinimumRequirementsEnum;

  @Prop()
  public minimumRequirementsPurchaseAmount: number;

  @Prop()
  public minimumRequirementsQuantityOfItems: number;
}

export interface CouponTypeFreeShippingEmbeddedDocument extends Types.Subdocument, CouponTypeFreeShipping {
  _id?: never;
}

export const CouponTypeFreeShippingSchema: Schema<CouponTypeFreeShippingEmbeddedDocument> =
  SchemaFactory.createForClass(CouponTypeFreeShipping);

export const CouponTypeFreeShippingSchemaName: string = CouponTypeFreeShipping.name;
