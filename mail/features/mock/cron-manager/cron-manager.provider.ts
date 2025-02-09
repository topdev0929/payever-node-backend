import { INestApplication, Logger } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { ProviderInterface } from '@pe/cucumber-sdk';
import { CronManagerMock } from './cron-manager.mock';
import { CampaignDataSender } from '../../../src/modules/campaign/cron-handler';

export const CRON_MANAGER_PROVIDER_NAME: string = 'CronManagerProvider';

export class CronManagerProvider implements ProviderInterface {
  protected application: INestApplication;
  protected logger: Logger;
  protected cronMock: CronManagerMock;

  public async configure(builder: TestingModuleBuilder, scenario: any): Promise<void> { }

  public async setup(application: INestApplication, logger: Logger): Promise<void> {
    this.application = application;
    this.logger = logger;

    this.cronMock = new CronManagerMock(
      this.application.get(CampaignDataSender),
    );
  }

  public async close(): Promise<void> {
    this.cronMock = null;
  }

  public getName(): string {
    return CRON_MANAGER_PROVIDER_NAME;
  }

  public async triggerCampaignSending(data: any): Promise<void> {
    await this.cronMock.triggerCampaignSending(data);
  }
}
