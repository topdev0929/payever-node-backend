import { CampaignDataSender } from '../../../src/modules/campaign/cron-handler';

export class CronManagerMock {
  constructor(
    private readonly campaignDataSender: CampaignDataSender,
  ) { }

  public async triggerCampaignSending(data: any): Promise<void> {
    await this.campaignDataSender.sendCampaignData(data);
  }
}
