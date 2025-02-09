import { Schema, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import {
    couponTypeSchemaOptions,
} from '../const/const';
import { CouponTypeEnum } from '../enum';

@SchemaDecorator(couponTypeSchemaOptions)
export class CouponType {
  public type: CouponTypeEnum;
}

export interface CouponTypeEmbeddedDocument extends Types.Subdocument, CouponType { }

export const CouponTypeSchema: Schema<CouponTypeEmbeddedDocument> =
  SchemaFactory.createForClass(CouponType);

export const CouponTypeSchemaName: string = CouponType.name;
