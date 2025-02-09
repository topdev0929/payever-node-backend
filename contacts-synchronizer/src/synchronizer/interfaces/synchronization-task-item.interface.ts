import { ImportedItemTypesEnum } from '@pe/synchronizer-kit';

export interface SynchronizationTaskItemInterface {
  email: string;
  isProcessed?: boolean;
  taskId: string;
  type: ImportedItemTypesEnum;
}
