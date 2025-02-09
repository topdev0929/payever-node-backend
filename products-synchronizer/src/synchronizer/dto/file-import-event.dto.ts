import { SynchronizationTaskErrorInterface } from '../interfaces';
import { ImportedSummaryItemDto } from './imported-summary-item.dto';

export interface FileImportEventDto<T> {
  business: { id: string };
  synchronization: { taskId: string };
  data: T;
  items?: ImportedSummaryItemDto[];
  errors?: SynchronizationTaskErrorInterface[];
}
