import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const TrustedDomainSchemaName: string = 'TrustedDomain';
export const TrustedDomainSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    domain: String,
  },
);
