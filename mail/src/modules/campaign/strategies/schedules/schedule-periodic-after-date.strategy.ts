import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ScheduleStrategyInterface } from './interfaces';
import { ScheduleIntervalEnum, ScheduleStatusEnum, ScheduleTypeEnum, ServiceTagEnum } from '../../enums';
import { CampaignModel, ScheduleModel } from '../../models';
import { EmailService, ScheduleService } from '../../services';
import { DateHelper } from '../../helpers/date-helper';

@Injectable()
@ServiceTag(ServiceTagEnum.Schedule)
export class SchedulePeriodicAfterDateStrategy implements ScheduleStrategyInterface {
  public readonly type: ScheduleTypeEnum = ScheduleTypeEnum.PeriodicAfterDate;

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly emailService: EmailService,
    private readonly logger: Logger,
  ) {
  }

  public async runTask(
    schedule: ScheduleModel,
  ): Promise<void> {
    try {
      const campaign: CampaignModel = JSON.parse(JSON.stringify(schedule.campaign));

      if (!schedule.date  || !schedule.interval) {
        await this.scheduleService.setFailCount(schedule.id, 'no template and builder mail id');
        await this.scheduleService.setToDraft(schedule.id);

        return ;
      }

      const status: ScheduleStatusEnum = await this.emailService.sendEmail(campaign);
      await this.setStatus(schedule,  status);
    } catch (e) {
      this.logger.log(`Error: ${e.message}`);
      await this.scheduleService.setFailCount(schedule.id, e.message);
      await this.scheduleService.setToDraft(schedule.id);
    }
  }

  private async setStatus(schedule: ScheduleModel, status: ScheduleStatusEnum): Promise<void> {
    schedule.history.push(new Date());

    switch (true) {
      case schedule.interval.type === ScheduleIntervalEnum.Hour:
        schedule.date = DateHelper.addHours(schedule.interval.number);
        break;
      case schedule.interval.type === ScheduleIntervalEnum.Day:
        schedule.date = DateHelper.addDays(schedule.interval.number);
        break;
      case schedule.interval.type === ScheduleIntervalEnum.Week:
        schedule.date = DateHelper.addWeeks(schedule.interval.number);
        break;
      case schedule.interval.type === ScheduleIntervalEnum.Month:
        schedule.date = DateHelper.addMonths(schedule.interval.number);
        break;
    }

    if (status === ScheduleStatusEnum.Fulfilled) {
      if (schedule.recurring.target) {
        schedule.recurring.fulfill = schedule.recurring.fulfill ? schedule.recurring.fulfill + 1 : 1;
        if (schedule.recurring.fulfill === schedule.recurring.target) {
          schedule.status = ScheduleStatusEnum.Fulfilled;
        }
      }
    } else {
      schedule.status = status;
    }

    await schedule.save();
  }
}
