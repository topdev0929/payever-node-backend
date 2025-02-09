// tslint:disable: no-useless-cast
import { v4 as uuid } from 'uuid';
import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { generate as generateCouponCode } from '../types/coupon-code.type';
import { CouponsStatusEnum, CouponTypeCustomerEligibilityEnum, CouponTypeEnum } from '../enum';
import {
  CouponsTypeFixedAmountSchema,
  CouponTypeBuyXGetYSchema,
  CouponTypeFreeShippingSchema,
  CouponTypePercentageSchema,
} from './coupon-type-subtypes';
import {
  CouponType,
  CouponTypeEmbeddedDocument,
  CouponTypeSchema,
} from './coupon-type.schema';
import {
  CouponLimitEmbeddedDocument,
  CouponLimit,
  CouponLimitSchema,
} from './coupons-limits.schema';

@SchemaDecorator({ timestamps: true })
export class Coupon<C extends CouponType = CouponType> {
  @Prop({ default: uuid })
  public _id?: string;

  @Prop({ index: true, required: true })
  public businessId: string;

  @Prop({ type: [String] })
  public channelSets: string[];

  @Prop({ index: true, required: true, default: generateCouponCode })
  public code: string;

  @Prop({ enum: CouponTypeCustomerEligibilityEnum })
  public customerEligibility: CouponTypeCustomerEligibilityEnum;

  @Prop({ type: [String] })
  public customerEligibilityCustomerGroups: string[];

  @Prop({ type: [String] })
  public customerEligibilitySpecificCustomers: string[];

  @Prop()
  public description: string;

  @Prop({ type: Date })
  public endDate: Date;

  @Prop({ type: Boolean })
  public isAutomaticDiscount: boolean;

  @Prop({ type: CouponLimitSchema })
  public limits: CouponLimit;

  @Prop()
  public name: string;

  @Prop({ required: true, type: Date })
  public startDate: Date;

  @Prop({
    default: CouponsStatusEnum.INACTIVE,
    enum: CouponsStatusEnum,
    required: true,
  })
  public status: CouponsStatusEnum;

  @Prop({ required: true, type: CouponTypeSchema })
  public type: C;
}

export type CouponInterface<C extends CouponType = CouponType> = Coupon<C>;

export interface CouponDocument<
  C extends CouponTypeEmbeddedDocument = CouponTypeEmbeddedDocument
> extends Document<string>, Coupon {
  _id: string;

  limits: CouponLimitEmbeddedDocument;

  type: C;
}

export const CouponSchema: Schema<CouponDocument> = SchemaFactory.createForClass(Coupon);

export const CouponSchemaName: string = 'Coupons';

CouponSchema.index({
  businessId: 1,
  code: 1,
}, {
  unique: true,
}).index({
  customerEligibilitySpecificCustomers: 1,
});

const typeField: Schema.Types.Embedded = CouponSchema.path('type');

typeField.discriminator(
    CouponTypeEnum.FIXED_AMOUNT,
    CouponsTypeFixedAmountSchema,
);
typeField.discriminator(
    CouponTypeEnum.PERCENTAGE,
    CouponTypePercentageSchema,
);
typeField.discriminator(
    CouponTypeEnum.FREE_SHIPPING,
    CouponTypeFreeShippingSchema,
);
typeField.discriminator(
    CouponTypeEnum.BUY_X_GET_Y,
    CouponTypeBuyXGetYSchema,
);
