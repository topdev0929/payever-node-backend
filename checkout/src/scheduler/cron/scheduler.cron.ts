import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { ScheduleService } from '../services';
import { TaskTypeEnum } from '../enum';

@Injectable()
export class SchedulerCron {
  constructor(
    private readonly scheduleService: ScheduleService,

  ) { }

  @Cron('*/1 * * * *', { name: TaskTypeEnum.paymentLinkReminder })
  public async remindExpiredPaymentLinks(): Promise<void> {
    await this.scheduleService.runScheduledTasks(TaskTypeEnum.paymentLinkReminder);
  }

  @Cron('*/1 * * * *', { name: TaskTypeEnum.paymentAction })
  public async triggerPaymentActions(): Promise<void> {
    await this.scheduleService.runScheduledTasks(TaskTypeEnum.paymentAction);
  }
}

