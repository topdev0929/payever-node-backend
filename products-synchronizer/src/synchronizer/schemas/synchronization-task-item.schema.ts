import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SynchronizationTaskSchemaName } from './synchronization-task.schema';

export const SynchronizationTaskItemSchemaName: string = 'SynchronizationTaskItem';

export const SynchronizationTaskItemSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    sku: { type: String },
    task: { type: String, ref: SynchronizationTaskSchemaName },
    type: { type: String },

    isProcessed: Boolean,
  },
  {
    timestamps: true,
  },
);

SynchronizationTaskItemSchema.index({ task: 1, sku: 1, type: 1 }, { unique: true });
