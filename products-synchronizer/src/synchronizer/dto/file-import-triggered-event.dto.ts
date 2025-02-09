import { FileImportInterface } from '@pe/synchronizer-kit';

export interface FileImportTriggeredEventDto {
  business: {
    id: string;
  };

  synchronization: {
    taskId: string;
  };

  fileImport: FileImportInterface;
}
