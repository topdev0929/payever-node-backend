import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessService } from '@pe/business-kit';
import { RabbitChannelsEnum } from '../../message/enums';
import {
  ConnectThirdPartyEnabledDto as ConnectThirdPartyToggleEnabledDto,
  ToggleApplicationSubscriptionDto,
  ThirdPartyConnection,
} from '../dto';
import { SubscriptionDocument } from '../models';
import { SubscriptionService } from '../services';
import { CommerceOsRmqEventsEnum, ConnectAppRmqEventsEnum, ThirdPartyMessenger } from '../enums';

@Controller()
export class MessageAppConsumer {
  constructor(
    private readonly subscriptionsService: SubscriptionService,
    private readonly businessService: BusinessService,
    private readonly logger: Logger,
  ) { }

  /**
   * @description Commerceos Message App was installed
   */
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: CommerceOsRmqEventsEnum.ApplicationInstalled,
  })
  public async onMessageApplicationInstalled(
    dto: ToggleApplicationSubscriptionDto,
  ): Promise<void> {
    //  message app installed for business
    this.logger.debug({
      context: 'MessageAppConsumer.onMessageApplicationInstalled',

      dto,
    });

    if (dto.code === 'message') {
      await this.businessService.updateById(dto.businessId, { enabled: true });
    }
  }

  /**
   * @description Commerceos Message App was uninstalled
   */
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: CommerceOsRmqEventsEnum.ApplicationUnInstalled,
  })
  public async onBusinessApplicationUninstalled(
    dto: ToggleApplicationSubscriptionDto,
  ): Promise<void> {
    //  message app uninstalled for business
    this.logger.debug({
      context: 'MessageAppConsumer.onBusinessApplicationUninstalled',

      dto,
    });

    if (dto.code === 'message') {
      await this.businessService.updateById(dto.businessId, { enabled: false });
    }
  }

  /**
   * @description Connect app was added
   */
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: ConnectAppRmqEventsEnum.ConnectAppEnabled,
  })
  public async onIntegrationInstalled(
    dto: ConnectThirdPartyToggleEnabledDto,
  ): Promise<void> {
    const subscription: SubscriptionDocument =
      await this.subscriptionsService.getSubscriptionByIntegrationCodeAndBusinessId({
        businessId: dto.businessId,
        code: dto.name,
      });
    if (!subscription) {
      return;
    }
    if (!subscription.installed) {
      await this.subscriptionsService.install(subscription);
    }
    if (!subscription.enabled) {
      await this.subscriptionsService.enable(subscription);
    }
  }

  /**
   * @description Connect app was removed
   */
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: ConnectAppRmqEventsEnum.ConnectAppDisabled,
  })
  public async onIntegrationUninstalled(
    dto: ConnectThirdPartyToggleEnabledDto,
  ): Promise<void> {
    const subscription: SubscriptionDocument =
      await this.subscriptionsService.getSubscriptionByIntegrationCodeAndBusinessId({
        businessId: dto.businessId,
        code: dto.name,
      });
    if (!subscription) {
      return;
    }
    if (subscription.installed) {
      await this.subscriptionsService.uninstall(subscription);
    }
    if (subscription.enabled) {
      await this.subscriptionsService.disable(subscription);
    }
  }

  /**
   * @description TPM connection added
   */
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: ThirdPartyMessenger.IntegrationConnected,
  })
  public async onConnectionAdded(
    dto: ThirdPartyConnection,
  ): Promise<void> {
  }

  /**
   * @description TPM connection removed
   */
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: ThirdPartyMessenger.IntegrationDisconnected,
  })
  public async onConnectionRemoved(
    dto: ThirdPartyConnection,
  ): Promise<void> {

  }
}
