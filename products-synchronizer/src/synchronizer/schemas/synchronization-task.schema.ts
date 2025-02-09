import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';
import { IntegrationSchemaName } from '@pe/synchronizer-kit';
import { FileImportSchemaName } from './file-import.schema';
import { SyncEventSchema } from './sync-event.schema';

export const SynchronizationTaskSchemaName: string = 'SynchronizationTask';

export const SynchronizationTaskSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    kind: String,

    businessId: { type: Schema.Types.String, required: true },
    integration: { type: Schema.Types.String, required: false, ref: IntegrationSchemaName },

    errorsList: [{ sku: String, messages: [String] }],
    fileImport: { type: Schema.Types.String, required: false, ref: FileImportSchemaName },

    direction: String,
    finishedAt: Date,
    status: String,

    events: { type: [SyncEventSchema], select: false },
    failureReason: { type: Schema.Types.Mixed },
    itemsSynced: Number,
    startedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);


/**
 * @warn index configuration may be invalid
 */
SynchronizationTaskSchema.index('startedAt' as any);
SynchronizationTaskSchema.index({ businessId: 1, integration: 1, direction: 1 });

SynchronizationTaskSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
