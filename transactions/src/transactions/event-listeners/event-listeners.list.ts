import {
  HistoryRecordEventListener,
  StatisticsEventListener,
  ValidateItemsBeforeActionListener,
  SaveItemsAfterActionListener,
  ValidateAmountBeforeActionListener,
  FolderDocumentsListener,
  SendHistoryEventAfterActionListener,
  BusinessEventListener,
  UpdateStatusInHistoryListener,
} from '../event-listeners';

export const EventListenersList: any[] = [
  HistoryRecordEventListener,
  SaveItemsAfterActionListener,
  SendHistoryEventAfterActionListener,
  StatisticsEventListener,
  ValidateAmountBeforeActionListener,
  // temporary disabling cause of complex merchant requests with wrong amounts
  // ValidateAmountMatchesItemsBeforeActionListener,
  ValidateItemsBeforeActionListener,
  FolderDocumentsListener,
  BusinessEventListener,
  UpdateStatusInHistoryListener,
];
