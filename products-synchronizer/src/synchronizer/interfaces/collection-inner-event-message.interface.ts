interface Synchronization {
  taskId: string;
  isFinished?: boolean;
}

export interface CollectionInnerEventMessageInterface {
  businessUuid: string;
  uuid?: string;
  synchronization?: Synchronization;
}
