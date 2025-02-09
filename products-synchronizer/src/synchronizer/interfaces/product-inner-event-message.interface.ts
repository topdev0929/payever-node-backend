interface Synchronization {
  taskId: string;
  isFinished?: boolean;
}

export interface ProductInnerEventMessageInterface {
  businessUuid: string;
  uuid?: string;
  synchronization?: Synchronization;
}
