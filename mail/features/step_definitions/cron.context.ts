import { After, Before, When } from '@cucumber/cucumber';
import { AbstractWorld, ContextInterface } from '@pe/cucumber-sdk';
import { CRON_MANAGER_PROVIDER_NAME, CronManagerProvider } from '../mock/cron-manager';

export class CronContext implements ContextInterface {
  public resolve(): void {
    Before(async function (scenario: any): Promise<void> {
      await this.init(scenario);
    });

    After(async function (): Promise<void> {
      await this.close();
    });

    When(
      /^campaign data sending triggered with data:$/,
      async function(
        this: AbstractWorld,
        data: string,
    ): Promise<void> {
        data = JSON.parse(data);
        await this.getProvider<CronManagerProvider>(CRON_MANAGER_PROVIDER_NAME).triggerCampaignSending(data);
      },
    );
  }
}
