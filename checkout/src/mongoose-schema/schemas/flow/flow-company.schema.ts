import { Schema } from 'mongoose';

export const FlowCompanySchema: Schema = new Schema(
  {
    externalId: { type: String },
    name: { type: String },
  },
  {
    id: false,
  },
);
