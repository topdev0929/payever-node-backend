export class IntegrationMessageDto {
  public business: {
    id: string;
  };
  public integration?: {
    name: string;
  };
  public synchronization?: {
    taskId: string;
    isFinished?: boolean;
  };
  public data: any[];
}
