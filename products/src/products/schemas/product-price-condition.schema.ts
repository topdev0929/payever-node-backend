// tslint:disable:object-literal-sort-keys
import {
  FilterFieldTypeEnum,
} from '@pe/nest-kit';
import { Schema } from 'mongoose';
import { PriceConditionFieldEnum, AllFilterFieldConditionObject } from '../enums';

export const ProductPriceConditionSchema: Schema = new Schema(
  {
    field: {
      required: true,
      type: String,
      enum: PriceConditionFieldEnum,
    },
    fieldType: {
      required: true,
      type: String,
      enum: FilterFieldTypeEnum,
    },
    fieldCondition: {
      required: true,
      type: String,
      enum: AllFilterFieldConditionObject,
    },
    value: {
      required: true,
      type: Schema.Types.Mixed,
    },
  },
  {
    _id: false,
  },
);
