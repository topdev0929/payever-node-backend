export interface CollectionSyncEventInterface {
  synchronization: {
    taskId: string;
    isFinished?: boolean;
  };

  itemId?: string;
}
