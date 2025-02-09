import { Schema } from 'mongoose';

export const PartnerTagItemSchemaName: string = 'PartnerTagItem';

export const PartnerTagItemSchema: Schema = new Schema(
  {
    name: { type: String },
  },
  {
    _id: false,
  },
);
