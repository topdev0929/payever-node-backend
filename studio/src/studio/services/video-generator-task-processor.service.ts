import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { AbstractCollector, Collector } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum } from '../enums';
import { VideoGeneratorTaskModel } from '../models';
import { VideoGeneratorTaskService } from '../services';
import { VideoGeneratorTaskStrategyInterface } from '../strategies/task/video-generator/interfaces';

@Injectable()
@Collector(ServiceTagEnum.VIDEO_GENERATOR_TASK)
export class VideoGeneratorTaskProcessorService extends AbstractCollector{

  constructor(
    private logger: Logger,
    private readonly taskService: VideoGeneratorTaskService,
  ) {
    super();
  }

  public async processTask(): Promise<void> {
    const tasks: VideoGeneratorTaskModel[] = await this.taskService.findWaitingTask();
    const promise: any[] = [];

    for (const task of tasks) {
      const strategy: VideoGeneratorTaskStrategyInterface = await this.getStrategy(task.task.type);
      promise.push(this.runTask(task, strategy));
    }

    await Promise.all(promise);
  }

  private async runTask(
    taskModel: VideoGeneratorTaskModel,
    strategy: VideoGeneratorTaskStrategyInterface,
  ): Promise<void> {
    try {
      await this.taskService.setProcessing(taskModel);
      await strategy.runTask(taskModel);
      await this.taskService.remove(taskModel);
    } catch (err) {
      this.logger.log(`Error: ${err}`);
      await this.taskService.setWaiting(taskModel);
    }
  }

  private async getStrategy(method: string) : Promise<VideoGeneratorTaskStrategyInterface> {
    for (const strategy of this.services) {
      if (!VideoGeneratorTaskProcessorService.isTaskStrategy(strategy)) {
        throw new RuntimeException(
          `Wrong service marked as a task strategy: ${
            strategy.constructor.name
          }`,
        );
      }
      if (strategy.type === method) {
        return strategy;
      }
    }

    throw new UnprocessableEntityException(
      `No appropriate strategy found to verify the code with parameters: ${method}`,
    );
  }

  private static isTaskStrategy(service: any): service is VideoGeneratorTaskStrategyInterface {

    return 'function' === typeof service.runTask;
  }
}
