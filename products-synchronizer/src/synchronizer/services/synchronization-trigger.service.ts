import { Injectable, Logger } from '@nestjs/common';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { spawn } from 'child_process';
import { environment } from '../../environments';
import { FileImportRequestedDto } from '../dto';
import { FileImportDto } from '../dto/file-import.dto';
import { SynchronizationDirectionEnum } from '../enums';
import { InnerEventProducer, OuterEventProducer } from '../producers';
import { SynchronizationTaskService } from './synchronization-task.service';
import { SynchronizationService } from './synchronization.service';

const CONSUMER_SCRIPT_PATH: string = 'deploy/trigger-sync-consumer.sh';

@Injectable()
export class SynchronizationTriggerService {
  constructor(
    private readonly innerEventProducer: InnerEventProducer,
    private readonly outerEventProducer: OuterEventProducer,
    private readonly synchronizationService: SynchronizationService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly businessService: BusinessService,
    private readonly logger: Logger,
  ) { }


  public async executeInitialTrigger(): Promise<void> {
    // check if current application is a dynamic consumer
    if (!environment.rabbitProductSyncQueueName) {
      return;
    }

    const synchronization = await this.synchronizationService.findById(environment.synchronizationId);
    if (!synchronization) {
      return;
    }

    const synchronizationTask = await this.synchronizationTaskService.getOne(environment.taskId);
    if (!synchronizationTask) {
      return;
    }

    this.logger.log(`Consumer Executing Action For Task ${synchronizationTask.id}`);

    await this.innerEventProducer.triggerInwardProductsSynchronize(
      synchronization,
      synchronizationTask,
    );
  }

  public async triggerProductsSynchronization(
    synchronization: SynchronizationModel,
    direction: SynchronizationDirectionEnum,
  ): Promise<void> {
    const task: SynchronizationTaskModel = await this.synchronizationTaskService.createFromSynchronization(
      synchronization,
      direction,
    );

    this.logger.log(`trigger product synchronization ${direction} ${task}`);

    switch (direction) {
      case SynchronizationDirectionEnum.INWARD:
        await this.startConsumer(synchronization.id, task.id, SynchronizationDirectionEnum.INWARD);
        await this.outerEventProducer.sendInwardSyncStarted(synchronization, task);

        break;
      case SynchronizationDirectionEnum.OUTWARD:
        await this.outerEventProducer.triggerOutwardProductsSynchronize(
          synchronization,
          task,
        );
        break;
    }
  }

  public async triggerInventorySynchronization(
    synchronization: SynchronizationModel,
  ): Promise<void> {
    await this.innerEventProducer.triggerInwardInventorySynchronize(
      synchronization,
      null,
    );
    await this.outerEventProducer.triggerOutwardInventorySynchronize(
      synchronization,
    );
  }

  public async triggerFileImportFromBus(dto: FileImportRequestedDto): Promise<SynchronizationTaskModel> {
    const business: BusinessModel = await this.businessService.findOneById(dto.businessId);

    return this.triggerFileImport(business, dto.fileImport);
  }

  public async triggerFileImport(
    business: BusinessModel,
    dto: FileImportDto,
  ): Promise<SynchronizationTaskModel> {
    const task: SynchronizationTaskModel = await this.synchronizationTaskService.createFileImport(
      business,
      dto,
    );
    await this.innerEventProducer.emitFileImportTriggeredEvent(task);

    return task;
  }

  public async startConsumer(
    synchronizationId: string,
    taskId: string,
    type: SynchronizationDirectionEnum
  ): Promise<any> {
    const script = spawn(CONSUMER_SCRIPT_PATH, {
      env: {
        SYNCHRONIZATION_ID: synchronizationId,
        TASK_ID: taskId,
        TYPE: type,
        ...process.env,
      },
    });

    script.stdout.on('data', (data) => {
      this.logger.log(data.toString());
    });

    script.stderr.on('data', (data) => {
      this.logger.error(`stderr: ${data}`);
    });

    script.on('close', (code) => {
      this.logger.log(`child process exited with code ${code}`);
    });
  }
}
