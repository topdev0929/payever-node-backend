import { HttpService, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { AbstractCollector, Collector } from '@pe/nest-kit/modules/collector-pattern';
import { MediaOwnerTypeEnum, MediaTypeEnum, ServiceTagEnum } from '../enums';
import { MediaInfoTaskModel, SubscriptionMediaModel, UserMediaModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaInfoTaskSchemaName, SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';
import { MediaInfoTaskService } from './media-info-task.service';
import { MediaInfoTaskStrategyInterface } from '../strategies/media-info/interfaces';

@Injectable()
@Collector(ServiceTagEnum.MEDIA_INFO_TASK)
export class MediaInfoTaskProcessorService extends AbstractCollector{

  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
    @InjectModel(MediaInfoTaskSchemaName) private readonly taskModel: Model<MediaInfoTaskModel>,
    private readonly taskService: MediaInfoTaskService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async processTask(): Promise<void> {
    const promise: any[] = [];

    promise.push(this.getTask(MediaTypeEnum.IMAGE, MediaOwnerTypeEnum.USER));
    promise.push(this.getTask(MediaTypeEnum.VIDEO, MediaOwnerTypeEnum.USER));
    promise.push(this.getTask(MediaTypeEnum.IMAGE, MediaOwnerTypeEnum.SUBSCRIPTION));
    promise.push(this.getTask(MediaTypeEnum.VIDEO, MediaOwnerTypeEnum.SUBSCRIPTION));

    await Promise.all(promise);
  }

  private async getTask(mediaType: MediaTypeEnum, mediaOwnerType: MediaOwnerTypeEnum): Promise<void> {
    const mediaInfoTasks: MediaInfoTaskModel[]
      = await this.taskService.findWaitingTask(mediaType, mediaOwnerType);
    const mediaInfoStrategy: MediaInfoTaskStrategyInterface
      = await this.getStrategy(mediaType, mediaOwnerType);

    return this.runTask(mediaInfoTasks, mediaInfoStrategy);
  }

  private async runTask(
    tasks: MediaInfoTaskModel[],
    strategy: MediaInfoTaskStrategyInterface,
  ): Promise<void> {
    try {
      await this.taskService.setProcessing(tasks);
      await strategy.runTask(tasks);
      await this.taskService.remove(tasks);
    } catch (err) {
      this.logger.log(`Error: ${err}`);
      await this.taskService.setWaiting(tasks);
    }
  }

  private async getStrategy(
    mediaType: MediaTypeEnum,
    ownerType: MediaOwnerTypeEnum,
  ) : Promise<MediaInfoTaskStrategyInterface> {
    for (const strategy of this.services) {
      if (!MediaInfoTaskProcessorService.isTaskStrategy(strategy)) {
        throw new RuntimeException(
          `Wrong service marked as a task strategy: ${
            strategy.constructor.name
          }`,
        );
      }
      if (strategy.mediaType === mediaType && strategy.ownerType === ownerType) {
        return strategy;
      }
    }

    throw new UnprocessableEntityException(
      `No appropriate strategy found to verify the code with parameters: ${mediaType} adn ${ownerType}`,
    );
  }

  private static isTaskStrategy(service: any): service is MediaInfoTaskStrategyInterface {
    return 'function' === typeof service.runTask;
  }
}
