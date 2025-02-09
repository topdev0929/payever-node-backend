import { Schema, Document, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

@SchemaDecorator({ _id: false })
export class CouponLimit {
  @Prop()
  public limitOneUsePerCustomer: boolean;

  @Prop()
  public limitUsage: boolean;

  @Prop()
  public limitUsageAmount: number;
}

export interface CouponLimitEmbeddedDocument extends CouponLimit, Types.EmbeddedDocument { }

export const CouponLimitSchema: Schema<CouponLimitEmbeddedDocument> = SchemaFactory.createForClass(CouponLimit);
export const CouponLimitsSchemaName: string = 'CouponsLimits';
