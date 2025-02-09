import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessService } from '@pe/business-kit'; 
import { BusinessModel } from '../../business/models';
import { BusinessServiceLocal } from '../../business/services';
import { RabbitChannelsEnum, RabbitEventNameEnum } from '../../environments/rabbitmq';
import { IntegrationEventDto, ThirdPartyConnectionChangedDto } from '../dto';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { IntegrationService, IntegrationSubscriptionService } from '../services';

@Controller()
export class IntegrationBusMessageController {
  constructor(
    private readonly businessServiceLocal: BusinessServiceLocal,
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.AppInstalled,
  })
  public async onAppInstalled(integrationEvent: IntegrationEventDto): Promise<void> {
    await validate(integrationEvent);
    if (integrationEvent.category !== 'shippings') {
      return;
    }
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationEvent.name);
    if (!integration) {
      return;
    }
    const business: BusinessModel = await this.businessService
    .findOneById(integrationEvent.businessId) as BusinessModel;

    if (!business) {
      return;
    }
    
    await this.integrationSubscriptionService.install(integration, business);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.AppUninstalled,
  })
  public async onAppUninstalled(integrationEvent: IntegrationEventDto): Promise<void> {
    await validate(integrationEvent);
    if (integrationEvent.category !== 'shippings') {
      return;
    }
    const integration: IntegrationModel =  await this.integrationService
    .findOneByName(integrationEvent.name);

    if (!integration) {
      return;
    }

    const business: BusinessModel = await this.businessService
    .findOneById(integrationEvent.businessId) as BusinessModel;
    
    await this.integrationSubscriptionService.uninstall(integration, business);
    const integrations: IntegrationSubscriptionModel[] = await this.businessServiceLocal
    .activeIntegrationSubscriptions(business);
    if (integrations.length === 0) {
      const customIntegration: IntegrationModel = await this.integrationService.findOneByName('custom');
      const customIntegrationSubscription: IntegrationSubscriptionModel = await this.integrationSubscriptionService
        .findOneByIntegrationAndBusiness(customIntegration, business);
      await this.integrationSubscriptionService.enable(customIntegrationSubscription, business);
    }
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.ThirdPartyConnected,
  })
  public async onThirdPartyAuthEnabled(connectionDto: ThirdPartyConnectionChangedDto): Promise<void> {
    await validate(connectionDto);
    const business: BusinessModel = await this.businessService.findOneById(connectionDto.business.id) as BusinessModel;
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
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.ThirdPartyDisconnected,
  })
  public async onThirdPartyAuthDisabled(connectionDto: ThirdPartyConnectionChangedDto): Promise<void> {
    await validate(connectionDto);
    const business: BusinessModel = await this.businessService.findOneById(connectionDto.business.id) as BusinessModel;
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
    const integrations: IntegrationSubscriptionModel[] = await this.businessServiceLocal
      .activeIntegrationSubscriptions(business);
    if (integrations.length === 0) {
      const customIntegration: IntegrationModel = await this.integrationService.findOneByName('custom');
      const customIntegrationSubscription: IntegrationSubscriptionModel = await this.integrationSubscriptionService
        .findOneByIntegrationAndBusiness(customIntegration, business);
      await this.integrationSubscriptionService.enable(customIntegrationSubscription, business);
    }
  }
}
