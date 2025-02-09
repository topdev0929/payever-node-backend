import { Schema } from 'mongoose';

export const FlowCartAttributesDimensionsSchema: Schema = new Schema(
  {
    height: { type: Number },
    length: { type: Number },
    width: { type: Number },
  },
  {
    _id: false,
  },
);
