import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import Mixed = Schema.Types.Mixed;

export const PaymentMailSchemaName: string = 'PaymentMail';

export const PaymentMailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    eventData: Mixed,
    templateName: String,
    transactionId: String,
  },
  {
    timestamps: true,
  },
);
