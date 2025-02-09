import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { SCHEDULER_TASK_PROCESSOR } from '../../constants';
import { ScheduleInterface, SchedulerTaskProcessorInterface } from '../../interfaces';
import { TaskTypeEnum } from '../../enum';
import { PaymentModel, PaymentService } from '../../../legacy-api';
import { PaymentListFilterDto } from '../../../legacy-api/dto/request/v1';
import { RabbitEventsProducer } from '../../../common';
import { ScheduleService } from '../schedule.service';

@Injectable()
@ServiceTag(SCHEDULER_TASK_PROCESSOR)
export class PaymentActionProcessor implements SchedulerTaskProcessorInterface {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly paymentService: PaymentService,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly logger: Logger,
  ) { }

  public getIdentifier(): TaskTypeEnum {
    return TaskTypeEnum.paymentAction;
  }

  public async runTask(
    schedule: ScheduleInterface,
  ): Promise<void> {
    const filter: PaymentListFilterDto = new PaymentListFilterDto(
      schedule.paymentMethod,
      null,
      null,
      schedule.filter?.status,
      null,
    );
    filter.dateGt = schedule.filter?.dateGt;
    filter.dateLt = schedule.filter?.dateLt;
    filter.totalGt = schedule.filter?.totalGt;
    filter.totalLt = schedule.filter?.totalLt;
    filter.specificStatus = schedule.filter?.specificStatus;
    filter.paymentId = schedule.paymentId;

    const payments: PaymentModel[] = await this.paymentService.findByBusinessAndFilter(schedule.businessId, filter);
    this.logger.log(
      {
        business: schedule.businessId,
        message: `Found ${payments.length} payments for scheduled task ${schedule.task}`,
        schedule: schedule._id,
      },
      'PaymentActionProcessor',
    );

    if (!payments.length) {
      return;
    }

    for (const payment of payments) {
      await this.rabbitEventsProducer.sendScheduledPaymentActionEvent({ schedule, paymentId: payment.original_id });
    }

    await this.scheduleService.updateLastRun(schedule);
  }
}
