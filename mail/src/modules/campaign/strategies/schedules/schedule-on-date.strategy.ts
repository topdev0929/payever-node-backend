import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ScheduleStrategyInterface } from './interfaces';
import { ScheduleStatusEnum, ScheduleTypeEnum, ServiceTagEnum } from '../../enums';
import { CampaignModel, ScheduleModel } from '../../models';
import { EmailService, ScheduleService } from '../../services';

@Injectable()
@ServiceTag(ServiceTagEnum.Schedule)
export class ScheduleOnDateStrategy implements ScheduleStrategyInterface {
  public readonly type: ScheduleTypeEnum = ScheduleTypeEnum.OnDate;

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

      if (!schedule.date ) {
        await this.scheduleService.setFailCount(schedule.id, 'no template and builder mail id');
        await this.scheduleService.setToDraft(schedule.id);

        return ;
      }

      const status: ScheduleStatusEnum = await this.emailService.sendEmail(campaign);
      await this.setStatus(schedule, status);
    } catch (e) {
      this.logger.log(`Error: ${e.message}`);
      await this.scheduleService.setFailCount(schedule.id, e.message);
      await this.scheduleService.setToDraft(schedule.id);
    }
  }

  private async setStatus(schedule: ScheduleModel, status: ScheduleStatusEnum): Promise<void> {
    schedule.history.push(new Date());
    schedule.status = status;
    await schedule.save();
  }
}
