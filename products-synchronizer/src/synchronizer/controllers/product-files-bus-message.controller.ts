import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { RabbitChannelEnum } from '../../environments';
import { FileImportRequestedDto, ImportFailedDto, ImportSuccessDto, ProductImportedDto } from '../dto/product-files-rabbit-messages';
import { ProductFilesRabbitMessagesEnum } from '../enums';
import { OuterProcessService, SynchronizationTaskService, SynchronizationTriggerService } from '../services';

@Controller()
export class ProductFilesBusMessageController {
  constructor(
    private readonly processService: OuterProcessService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly synchronizationTriggerService: SynchronizationTriggerService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductFilesRabbitMessagesEnum.ProductImported,
  })
  public async handleProductImportedEvent(dto: ProductImportedDto): Promise<void> {
    this.logger.log({
      dto,
      message: 'Product file import event',
    });

    await this.processService.processProductImportedEvent(dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductFilesRabbitMessagesEnum.ImportRequested,
  })
  public async handleImportCreatedEvent(dto: FileImportRequestedDto): Promise<void> {
    this.logger.log({
      dto,
      message: 'Product file import event: created',
    });

    await this.synchronizationTriggerService.triggerFileImportFromBus(dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductFilesRabbitMessagesEnum.ImportSuccess,
  })
  public async handleImportSuccessEvent(dto: ImportSuccessDto): Promise<void> {
    this.logger.log({
      dto,
      message: 'Product file import event',
    });

    await this.synchronizationTaskService.setParsingResult(dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: ProductFilesRabbitMessagesEnum.ImportFailed,
  })
  public async handleImportFailureEvent(dto: ImportFailedDto): Promise<void> {
    this.logger.log({
      dto,
      message: 'Product file import event',
    });

    const task: SynchronizationTaskModel = await this.synchronizationTaskService.getOne(dto.synchronization.taskId);
    if (!task) {
      this.logger.error({
        dto,
        message: 'Task is not found',
      });

      return;
    }

    await this.synchronizationTaskService.taskFail(task, dto.data);
  }
}
