import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CompanyDocumentsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    commercialRegisterExcerptFilename: String,
  },
  {
    timestamps: { },
  },
);
