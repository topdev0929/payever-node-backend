import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessLocalModel } from '../../business/models';
import { BusinessLocalService } from '../../business/services';
import { RabbitChannelsEnum, RabbitEventNameEnum } from '../../common';
import { IntegrationEventDto, ThirdPartyConnectionChangedDto } from '../dto';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { IntegrationService, IntegrationSubscriptionService } from '../services';

@Controller()
export class IntegrationBusMessageController {
  constructor(
    private readonly businessService: BusinessLocalService,
    private readonly integrationService: IntegrationService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Social,
    name: RabbitEventNameEnum.AppInstalled,
  })
  public async onAppInstalled(integrationEvent: IntegrationEventDto): Promise<void> {
    await validate(integrationEvent);
    if (integrationEvent.category !== 'social') {
      return;
    }
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationEvent.name);
    if (!integration) {
      return;
    }
    const business: BusinessLocalModel = await this.businessService.findOneById(integrationEvent.businessId);
    if (!business) {
      return;
    }
    await this.integrationSubscriptionService.install(integration, business);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Social,
    name: RabbitEventNameEnum.AppUninstalled,
  })
  public async onAppUninstalled(integrationEvent: IntegrationEventDto): Promise<void> {
    await validate(integrationEvent);
    if (integrationEvent.category !== 'social') {
      return;
    }
    const integration: IntegrationModel =  await this.integrationService.findOneByName(integrationEvent.name);
    if (!integration) {
      return;
    }
    const business: BusinessLocalModel = await this.businessService.findOneById(integrationEvent.businessId);
    await this.integrationSubscriptionService.uninstall(integration, business);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Social,
    name: RabbitEventNameEnum.ThirdPartyConnected,
  })
  public async onThirdPartyAuthEnabled(connectionDto: ThirdPartyConnectionChangedDto): Promise<void> {
    await validate(connectionDto);
    const business: BusinessLocalModel = await this.businessService.findOneById(connectionDto.business.id);
    if (!business) {
      return;
    }
    const integration: IntegrationModel =
      await this.integrationService.findOneByName(connectionDto.integration.name);
    if (!integration) {
      return;
    }
    const subscription: IntegrationSubscriptionModel = await this.integrationSubscriptionService
      .findOneByIntegrationAndBusiness(integration, business);
    if (!subscription) {
      return;
    }
    await this.integrationSubscriptionService.enable(subscription, business);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Social,
    name: RabbitEventNameEnum.ThirdPartyDisconnected,
  })
  public async onThirdPartyAuthDisabled(connectionDto: ThirdPartyConnectionChangedDto): Promise<void> {
    await validate(connectionDto);
    const business: BusinessLocalModel = await this.businessService.findOneById(connectionDto.business.id);
    if (!business) {
      return;
    }
    const integration: IntegrationModel =
      await this.integrationService.findOneByName(connectionDto.integration.name);
    if (!integration) {
      return;
    }
    const subscription: IntegrationSubscriptionModel = await this.integrationSubscriptionService
      .findOneByIntegrationAndBusiness(integration, business);
    if (!subscription) {
      return;
    }
    await this.integrationSubscriptionService.disable(subscription);
  }
}
