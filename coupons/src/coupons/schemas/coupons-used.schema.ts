import { v4 as uuid } from 'uuid';

import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { CouponSchemaName } from './coupon.schema';

@SchemaDecorator()
export class CouponUsed {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({ ref: CouponSchemaName })
  public coupon: string;

  @Prop()
  public email: string;
}

export interface CouponUsedDocument extends Document<string>, CouponUsed {
  _id: string;
}

export const CouponUsedSchema: Schema<CouponUsedDocument> = SchemaFactory.createForClass(CouponUsed);

export const CouponUsedSchemaName: string = 'CouponsUsed';
