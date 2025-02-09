import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { SubscriptionService, MarketplaceAssigmentService } from '../services';
import { IntegrationExported, IntegrationInstalledUninstalled, IntegrationConnectedDisconnected } from '../dto';
import { SubscriptionInterface } from '../interfaces';
import { SubscriptionModel } from '../models';
import { MessageBusChannelsEnum } from '../../shared';

@Controller()
export class ThirdPartyBusMessageController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly marketplaceAssigmentService: MarketplaceAssigmentService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ThirdPartyInstalled,
  })
  public async onThirdPartyInstalledEvent(dto: IntegrationInstalledUninstalled): Promise<void> {
    this.logger.log(`ThirdParty Installed: ${JSON.stringify(dto)}`);
    await validate(dto);
    if (dto.category !== 'products') {
      return;
    }
    const subscription: SubscriptionInterface = {
      ...dto,
      installed: true,
    };
    await this.subscriptionService.updateOrCreateSubsciption(subscription);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ThirdPartyUninstalled,
  })
  public async onThirdPartyUninstalledEvent(dto: IntegrationInstalledUninstalled): Promise<void> {
    this.logger.log(`ThirdParty Uninstalled: ${JSON.stringify(dto)}`);
    await validate(dto);
    if (dto.category !== 'products') {
      return;
    }
    const subscription: SubscriptionInterface = {
      ...dto,
      installed: false,
    };
    await this.subscriptionService.updateOrCreateSubsciption(subscription);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ThirdPartyConnected,
  })
  public async onThirdPartyConnectedEvent(dto: IntegrationConnectedDisconnected): Promise<void> {
    this.logger.log(`ThirdParty Connected: ${JSON.stringify(dto)}`);
    await validate(dto);
    if (dto.integration.category !== 'products') {
      return;
    }
    const subscription: SubscriptionInterface = {
      businessId: dto.business.id,
      connected: true,
      name: dto.integration.name,
    };
    await this.subscriptionService.updateOrCreateSubsciption(subscription);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ThirdPartyDisconnected,
  })
  public async onThirdPartyDisconnectedEvent(dto: IntegrationConnectedDisconnected): Promise<void> {
    this.logger.log(`ThirdParty Disconnected: ${JSON.stringify(dto)}`);
    await validate(dto);
    if (dto.integration.category !== 'products') {
      return;
    }
    const subscription: SubscriptionInterface = {
      businessId: dto.business.id,
      connected: false,
      name: dto.integration.name,
    };
    const subscriptionModel: SubscriptionModel = await this.subscriptionService.updateOrCreateSubsciption(subscription);
    await this.marketplaceAssigmentService.removeSubscription(subscriptionModel);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ThirdPartyExported,
  })
  public async onThirdPartyExportEvent(dto: IntegrationExported): Promise<void> {
    this.logger.log(`ThirdParty Exported: ${JSON.stringify(dto)}`);
    await validate(dto);
    await this.subscriptionService.importSubscription(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ThirdPartyExportedFromConnect,
  })
  public async onThirdPartyExportFromConnectEvent(dto: IntegrationExported): Promise<void> {
    this.logger.log(`ThirdParty Exported From Connect: ${JSON.stringify(dto)}`);
    await validate(dto);
    await this.subscriptionService.importSubscription(dto);
  }
}
