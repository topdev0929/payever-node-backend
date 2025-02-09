import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { DimensionEnum } from '../enums';

export const DimensionSchemaName: string = 'Dimension';
export const DimensionSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    field: {
      required: true,
      type: Schema.Types.String,
    },
    name: {
      required: true,
      type: DimensionEnum,
    },
    sizes: [{
      required: true,
      type: Schema.Types.String,
    }],
    types: [{
      required: true,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
  },
);
