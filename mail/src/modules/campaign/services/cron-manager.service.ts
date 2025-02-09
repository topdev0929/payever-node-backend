import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleModel } from '../models';
import { ScheduleService } from './schedule.service';
import { AbstractCollector, Collector } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum } from '../enums';
import { ScheduleStrategyInterface } from '../strategies/schedules/interfaces';

@Injectable()
@Collector(ServiceTagEnum.Schedule)
export class CronManagerService extends AbstractCollector {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<ScheduleModel>,
    private readonly scheduleService: ScheduleService,
  ) {
    super();
  }

  public async runCron(): Promise<void> {
    const schedules: ScheduleModel[] = await this.scheduleService.getActiveSchedule();
    const promise: any[] = [];

    for (const schedule of schedules) {
      const strategy: ScheduleStrategyInterface = await this.getStrategy(schedule.type);
      promise.push(strategy.runTask(schedule));
    }

    await Promise.all(promise);
  }

  private async getStrategy(method: string) : Promise<ScheduleStrategyInterface> {
    for (const strategy of this.services) {
      if (!CronManagerService.isTaskStrategy(strategy)) {
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

  private static isTaskStrategy(service: any): service is ScheduleStrategyInterface {

    return 'function' === typeof service.runTask;
  }
}
