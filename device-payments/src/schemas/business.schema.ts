import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { VerificationType } from '../enum';

const applicationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    type: String,
  }
);

export const BusinessSchemaName: string = 'Business';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    defaultApplications: {
      default: [],
      type: [{ type: applicationSchema }],
    },
    defaultTerminalId: String,
    settings: {
      autoresponderEnabled: { type: Boolean, default: true },
      enabled: { type: Boolean, default: false },
      secondFactor: { type: Boolean, default: false },
      verificationType: { type: VerificationType, default: VerificationType.verifyByPayment },
    },
  },
  {
    collection: 'businesses',
  },
).index({ businessId: 1 });
