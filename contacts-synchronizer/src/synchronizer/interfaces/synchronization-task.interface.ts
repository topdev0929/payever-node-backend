
import { BusinessInterface } from '@pe/business-kit';
import {
  SynchronizationStatusEnum,
  SynchronizationTasKindEnum ,
  SyncEventInterface,
} from '@pe/synchronizer-kit';

import { SynchronizationTaskErrorInterface } from './synchronization-task-error.interface';
import { SynchronizationTaskExtraArgumentsInterface } from './synchronization-task-extra-arguments.interface';

export interface SynchronizationTaskInterface {
  kind: SynchronizationTasKindEnum;

  business?: BusinessInterface;
  businessId: string;

  fileImportId?: string;
  integrationId?: string;

  extraArguments?: SynchronizationTaskExtraArgumentsInterface;

  status: SynchronizationStatusEnum;
  direction: string;
  itemsSynced: number;
  events: SyncEventInterface[];

  errorsList: SynchronizationTaskErrorInterface[];

  failureReason?: any;

  startedAt?: Date;
}
