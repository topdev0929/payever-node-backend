export interface ContactSynchronizationFailedDto {
  contact: {
    email: string;
  };

  synchronization: {
    taskId: string;
    taskItemId: string;
  };

  errorMessage: string;
}
