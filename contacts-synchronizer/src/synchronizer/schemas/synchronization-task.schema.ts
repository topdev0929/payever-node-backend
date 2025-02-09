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
    integrationId: { type: Schema.Types.String, required: false },

    extraArguments: {
      type: Schema.Types.Mixed,
      required: false,
    },

    errorsList: [{ email: String, messages: [String] }],
    fileImportId: { type: Schema.Types.String, required: false },

    direction: String,
    finishedAt: Date,
    status: String,

    events: { type: [SyncEventSchema], select: false },
    failureReason: { type: Schema.Types.Mixed },
    itemsSynced: Number,
    startedAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  },
);

SynchronizationTaskSchema.index({ startedAt: 1});
SynchronizationTaskSchema.index({ businessId: 1, integration: 1, direction: 1 });

SynchronizationTaskSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
SynchronizationTaskSchema.virtual('integration', {
  ref: IntegrationSchemaName,
  localField: 'integrationId',
  foreignField: '_id',
  justOne: true,
});

SynchronizationTaskSchema.virtual('fileImport', {
  ref: FileImportSchemaName,
  localField: 'fileImportId',
  foreignField: '_id',
  justOne: true,
});
