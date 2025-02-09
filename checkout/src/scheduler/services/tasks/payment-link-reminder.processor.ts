import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { SCHEDULER_TASK_PROCESSOR } from '../../constants';
import { ScheduleInterface, SchedulerTaskProcessorInterface } from '../../interfaces';
import { TaskTypeEnum } from '../../enum';
import * as moment from 'moment';
import { PaymentLinkService } from '../../../payment-links/services/payment-link.service';
import { PaymentLinkModel } from '../../../payment-links/models';
import { EmailSender } from '../email.sender';
import { PaymentLinkResultDto } from '../../../payment-links/dto';
import { ScheduleService } from '../schedule.service';

@Injectable()
@ServiceTag(SCHEDULER_TASK_PROCESSOR)
export class PaymentLinkReminderProcessor implements SchedulerTaskProcessorInterface {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly paymentLinkService: PaymentLinkService,
    private readonly emailSender: EmailSender,
    private readonly logger: Logger,
  ) { }

  public getIdentifier(): TaskTypeEnum {
    return TaskTypeEnum.paymentLinkReminder;
  }

  public async runTask(
    schedule: ScheduleInterface,
  ): Promise<void> {
    const dateLtFallback: Date = moment(new Date()).subtract(schedule.duration.period, schedule.duration.unit).toDate();
    let dateFilter: any = { $lt: schedule.filter?.dateLt ? schedule.filter.dateLt : dateLtFallback };
    if (schedule.filter?.dateGt) {
      dateFilter = {
        ...dateFilter,
        $gt: schedule.filter.dateGt,
      };
    }

    const filter: any = {
      business_id: schedule.businessId,
      created_at: dateFilter,
      payment_id: null,
      reusable: false,

      $or: [
        { expires_at: null },
        { expires_at: { $exists: false } },
        { expires_at: { $gt: new Date() } },
      ],
    };

    const paymentLinkModels: PaymentLinkModel[] = await this.paymentLinkService.findPaymentLinksByConditions(filter);
    this.logger.log(
      {
        business: schedule.businessId,
        message: `Found ${paymentLinkModels.length} payments links for scheduled task ${schedule.task}`,
        schedule: schedule._id,
      },
      'PaymentLinkReminderProcessor',
    );

    if (!paymentLinkModels.length) {
      return;
    }

    for (const paymentLink of paymentLinkModels) {
      const result: PaymentLinkResultDto = await this.paymentLinkService.preparePaymentLinkResult(paymentLink, false);
      const redirectUrl: string = result.redirect_url;
      await this.emailSender.sendPaymentLinkReminderEmail(paymentLink.email, redirectUrl);
    }

    await this.scheduleService.updateLastRun(schedule);
  }
}
