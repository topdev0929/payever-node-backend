import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { CronManagerService } from '../services';
import { CampaignDataSender } from './campaign-data-sender';

@Injectable()
export class CampaignCron {

  constructor(
    private readonly cronManager: CronManagerService,
    private readonly campaignDataSender: CampaignDataSender,
  ) {
  }

  @Cron('*/10 * * * * *')
  private async processSchedulerTask(): Promise<void> {
    await this.cronManager.runCron();
  }

  @Cron('* * * * *')
  private async processCampaignByBus(): Promise<void> {
    await this.campaignDataSender.runTasks();
  }
}
