import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
export const ArchivedTransactionSchemaName: string = 'ArchivedTransaction';
export const ArchivedTransactionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: {
      required: true,
      type: String,
    },

    data: {
      type: Object,
    },
    encryptedData: {
      type: String,
    },
    uuid: { type: String, required: true },

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

ArchivedTransactionSchema.index({ archiveEmail: 1 });
ArchivedTransactionSchema.index({ businessId: 1 });
