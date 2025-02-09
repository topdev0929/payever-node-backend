import { Schema } from 'mongoose';
import { FlowCartAttributesDimensionsSchema } from './flow-cart-attributes-dimensions.schema';

export const FlowCartAttributesSchema: Schema = new Schema(
  {
    dimensions: { type: FlowCartAttributesDimensionsSchema },
    weight: { type: Number },
  },
  {
    _id: false,
  },
);
