import { Injectable, Logger } from '@nestjs/common';
import { CampaignEventsProducer } from '../producers';
import { CronTaskModel } from '../models';
import { CampaignCronService } from '../services';

@Injectable()
export class CampaignDataSender {
  constructor(
    private readonly logger: Logger,
    private readonly campaignEventsProducer: CampaignEventsProducer,
    private readonly campaignCronService: CampaignCronService,
  ) { }

  public async runTasks(): Promise<void> {
    const tasks: CronTaskModel[] = await this.campaignCronService.getTasksToSend();
    for (const task of tasks) {
      await this.sendCampaignData(task.input);
    }
  }

  public async sendCampaignData(data: any): Promise<void> {
    this.logger.log('Send event with campaign data');
    try {
      await this.campaignEventsProducer.campaignSend(data);
    } catch (error) {
      this.logger.error({
        error: error.message,
        message: 'Campaign cron: Failed to send campaign rabbit message',
      });
    }
  }
}
