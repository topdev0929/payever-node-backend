import { Schema } from 'mongoose';
import { MediaSchema } from './media.schema';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },    
  },
  {
    timestamps: { },
  },
);
