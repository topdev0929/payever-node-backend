import { Injectable } from '@nestjs/common';
import {
  FileImportModel,
  SynchronizationTasKindEnum,
  SynchronizationDirectionEnum,
  SynchronizationStatusEnum,
  FileImportInterface,
} from '@pe/synchronizer-kit';

import {
  SynchronizationTaskService,
  FileImportService,
  SynchronizationTaskModel,
  InnerEventProducer,
  SynchronizationTaskExtraArgumentsInterface,
} from '../../synchronizer';

@Injectable()
export class ControllerHandlerService {
  constructor(
    private readonly fileImportService: FileImportService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly innerEventProducer: InnerEventProducer,
  ) { }

  public async handleCreateTask(
    businessId: string,
    dto: FileImportInterface,
    extraArguments?: SynchronizationTaskExtraArgumentsInterface,
  ): Promise<SynchronizationTaskModel> {
    const fileImport: FileImportModel = await this.fileImportService.create(dto);

    const task: SynchronizationTaskModel = await this.synchronizationTaskService.create({
      businessId: businessId,
      kind: SynchronizationTasKindEnum.FileImport,

      extraArguments,

      direction: SynchronizationDirectionEnum.INWARD,
      fileImportId: fileImport.id,
      status: SynchronizationStatusEnum.IN_QUEUE,

      errorsList: [],
      events: [],
      itemsSynced: 0,
    });

    await this.innerEventProducer.produceTaskCreated(task);

    return task;
  }
}
