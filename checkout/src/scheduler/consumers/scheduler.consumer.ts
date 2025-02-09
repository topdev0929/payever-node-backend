import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ScheduleInterface } from '../interfaces';
import { MessageBusEventsEnum } from '../../common';
import { TasksProcessorsCollector } from '../services';
import { PaymentModel, PaymentService, UrlActionsToPaymentActions } from '../../legacy-api';
import { MessageBusChannelsEnum } from '../../environments';

@Controller()
export class SchedulerConsumer {
  constructor(
    private readonly tasksProcessorsCollector: TasksProcessorsCollector,
    private readonly paymentService: PaymentService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: MessageBusEventsEnum.scheduledTaskExecute,
  })
  public async executeScheduledTask(schedule: ScheduleInterface): Promise<void> {
    await this.tasksProcessorsCollector.runTask(schedule);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: MessageBusEventsEnum.scheduledPaymentActionRun,
  })
  public async runScheduledPaymentAction(data: { schedule: ScheduleInterface; paymentId: string }): Promise<void> {
    const schedule: ScheduleInterface = data.schedule;
    const paymentModel: PaymentModel = await this.paymentService.findByUuid(data.paymentId);
    if (!paymentModel) {
      return;
    }

    try {
      const action: string = UrlActionsToPaymentActions.get(schedule.action.toLowerCase());
      await this.paymentService.externalAction(
        paymentModel,
        {
          action,
          payloadDto: schedule.payload,
        },
      );
    } catch (e) {
      this.logger.warn(
        {
          action: schedule.action,
          business: schedule.businessId,
          error: e.message,
          message: 'Failed to execute payment action from scheduled task',
          payment: data.paymentId,
          schedule: schedule._id,
        },
        'SchedulerConsumer',
      );
    }
  }
}
