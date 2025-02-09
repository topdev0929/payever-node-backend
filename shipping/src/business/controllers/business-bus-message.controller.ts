import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessService } from '@pe/business-kit';

import { RabbitEventNameEnum, RabbitChannelsEnum } from '../../environments/rabbitmq';
import { IntegrationModel, IntegrationRuleModel, IntegrationSubscriptionModel } from '../../integration/models';
import { IntegrationRuleService, IntegrationService, IntegrationSubscriptionService } from '../../integration/services';

import { AppRegistryEventDto } from '../dto';
import { BusinessModel } from '../models';
import { BusinessServiceLocal } from '../services';

@Controller()
export class BusinessBusMessageController {
  constructor(
    private readonly businessServiceLocal: BusinessServiceLocal,
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly integrationRuleService: IntegrationRuleService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.AppRegistryInstalled,
  })
  public async onAppRegistryInstalled(appRegistryEvent: AppRegistryEventDto): Promise<void> {
    this.logger.log(`App installed: ${appRegistryEvent.code}`);
    await validate(appRegistryEvent);
    if (appRegistryEvent.code !== 'shipping') {
      return;
    }
    const business: BusinessModel = await this.businessService
    .findOneById(appRegistryEvent.businessId) as BusinessModel;

    if (!business) {
      return;
    }

    const customIntegration: IntegrationModel = await this.integrationService.findOneByName('custom');
    if (!customIntegration) {
      return;
    }
    const businessWithIntegrations: BusinessModel = await this.businessServiceLocal.populateIntegrations(business);
    const customIntegrationSubscription: IntegrationSubscriptionModel
      =  businessWithIntegrations.integrationSubscriptions
      .find((subscription: IntegrationSubscriptionModel) => subscription.integration._id === customIntegration._id);
    const existingRules: any[] = customIntegrationSubscription && customIntegrationSubscription.rules
      ? customIntegrationSubscription.rules
      : [];

    if (customIntegrationSubscription && existingRules.length > 0) {
      return;
    }
    const createdCustomIntegrationsubscription: IntegrationSubscriptionModel = await this.integrationSubscriptionService
      .findOrCreateSubscription(customIntegration, business);
    const defaultRules: IntegrationRuleModel[] = await this.integrationRuleService.createDefaultRules();

    await this.integrationSubscriptionService.setRules(createdCustomIntegrationsubscription, defaultRules);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.AppRegistryUninstalled,
  })
  public async onAppRegistryUninstalled(appRegistryEvent: AppRegistryEventDto): Promise<void> {
    this.logger.log(`App uninstalled: ${appRegistryEvent.code}`);
    await validate(appRegistryEvent);
    if (appRegistryEvent.code !== 'shipping') {
      return;
    }
    const business: BusinessModel = await this.businessService
    .findOneById(appRegistryEvent.businessId) as BusinessModel;
    
    if (!business) {
      return;
    }
  }
}
