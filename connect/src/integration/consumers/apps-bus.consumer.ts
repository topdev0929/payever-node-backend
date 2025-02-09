import { Controller, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppDto, IntegrationDto } from '../dto';
import { MessageBusEventsEnum } from '../enum';
import { IntegrationService, IntegrationSubscriptionService } from '../services';
import { AppTransformer } from '../transformers';
import { BusinessModelLocal } from '../../business';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { BusinessService } from '@pe/business-kit';
import { RabbitChannelEnum } from '../../environments';
import { SetupConnectInterface } from '../interfaces';

@Controller()
export class AppsBusMessageController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly logger: Logger,
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: MessageBusEventsEnum.AppCreated,
  })
  public async appCreated(data: AppDto): Promise<void> {
    await this.processApp(data);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: MessageBusEventsEnum.AppUpdated,
  })
  public async appUpdated(data: AppDto): Promise<void> {
    await this.processApp(data);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: MessageBusEventsEnum.OnboardingSetupConnect,
  })
  public async onboardingInstallApps(data: SetupConnectInterface): Promise<void> {
    const businessModel: any = await this.businessService.findOneById(data.businessId);
    if (!businessModel) {
      await this.addToPending(data);

      return;
    }
    for (const integration of data.integrations) {
      await this.installIntegration(integration, businessModel, true);
    }
  }

  private async addToPending(data: SetupConnectInterface): Promise<void> {
    await this.integrationService.addPendingInstallation({ businessId: data.businessId, payload: data });
  }

  private async installIntegration(
    integrationName: string,
    business: BusinessModelLocal,
    registration: boolean = false,
  ): Promise<{ }> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(
      integrationName,
    );
    if (!integration) {
      if (registration) {
        return;
      }
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    // is allowed
    if (integration.allowedBusinesses && integration.allowedBusinesses.length &&
      integration.allowedBusinesses.indexOf(business._id) === -1) {
        if (registration) {
          return;
        }
        throw new BadRequestException(
          `Third party integration is not allowed for current business`,
        );
    }

    // isn't excluded
    if (business && business.excludedIntegrations.length > 0
      && business.excludedIntegrations.indexOf(integration._id) > -1) {
        if (registration) {
          return;
        }
        throw new BadRequestException(
          `Third party integration is not allowed for current business`,
        );
    }

    await this.subscriptionService.install(
      integration,
      business,
    );

    await this.integrationService.incrementInstallCounter(integration);
  }

  private async processApp(data: AppDto): Promise<void> {
    try {
      const dto: IntegrationDto = AppTransformer.appToIntegration(data);

      await this.integrationService.upsert(dto);
    } catch (err) {
      this.logger.error({
        error: err.message,
        text: '"apps.event.app.updated" error during data query.',
      });
    }
  }
}
