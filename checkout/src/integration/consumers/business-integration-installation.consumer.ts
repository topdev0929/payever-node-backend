import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { ToggleIntegrationSubscriptionDto } from '../dto';
import { BusinessIntegrationSubModel, IntegrationModel } from '../models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../services';

@Controller()
export class BusinessIntegrationInstallationConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: BusinessIntegrationSubscriptionService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.IntegrationInstalled,
  })
  public async onIntegrationForBusinessInstalledEvent(toggleDto: ToggleIntegrationSubscriptionDto): Promise<void> {
    await validate(toggleDto);

    const integration: IntegrationModel =
      await this.integrationService.findOneByName(toggleDto.name);
    if (!integration) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(toggleDto.businessId) as BusinessModel;
    if (!business) {
      return;
    }

    const subscription: BusinessIntegrationSubModel = await this.subscriptionService.install(integration, business);
    if (integration.autoEnable) {
      await this.subscriptionService.enable(subscription);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.IntegrationUninstalled,
  })
  public async onIntegrationForBusinessUninstalledEvent(toggleDto: ToggleIntegrationSubscriptionDto): Promise<void> {
    await validate(toggleDto);

    const integration: IntegrationModel = await this.integrationService.findOneByName(toggleDto.name);
    if (!integration) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(toggleDto.businessId) as BusinessModel;
    if (!business) {
      return;
    }

    await this.subscriptionService.uninstall(integration, business);
  }
}
