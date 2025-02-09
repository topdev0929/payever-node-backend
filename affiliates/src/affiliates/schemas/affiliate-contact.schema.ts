import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AffiliateContactSchemaName: string = 'AffiliateContact';
export const AffiliateContactSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);

