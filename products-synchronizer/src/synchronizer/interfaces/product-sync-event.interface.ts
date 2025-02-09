export interface ProductSyncEventInterface {
  synchronization: {
    taskId: string;
    isFinished?: boolean;
  };

  itemId?: string;
}
