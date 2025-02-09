import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SynchronizationTaskSchemaName } from './synchronization-task.schema';

export const SynchronizationTaskItemSchemaName: string = 'SynchronizationTaskItem';

export const SynchronizationTaskItemSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  email: { type: String, index: true },
  taskId: { type: String, index: true },
  type: { type: String },

  isProcessed: { type: Boolean, default: false },
}, {
  timestamps: true,
});

SynchronizationTaskItemSchema.index({ taskId: 1, email: 1, type: 1 }, { unique: true });

SynchronizationTaskItemSchema.virtual('task', {
  ref: SynchronizationTaskSchemaName,
  localField: 'taskId',
  foreignField: '_id',
  justOne: true,
});
