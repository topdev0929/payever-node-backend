import { SynchronizationTaskItemInterface } from '../interfaces';
import { Document } from 'mongoose';
import { SynchronizationTaskModel } from './synchronization-task.model';

export interface SynchronizationTaskItemModel extends SynchronizationTaskItemInterface, Document {
  readonly task?: SynchronizationTaskModel;
}
