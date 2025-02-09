import { BadRequestException, Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessService } from '@pe/business-kit';
import { RpcIntegrationSubscriptionInstallDto } from '../dto';
import { IntegrationSubscriptionModel, IntegrationModel } from '../models';
import { IntegrationService, IntegrationSubscriptionService } from '../services';
import { BusinessModelLocal } from '../../business';
import { RabbitChannelEnum } from '../../environments';

@Controller()
export class IntegrationSubscriptionConsumer {
  constructor(
    private readonly businessService: BusinessService<BusinessModelLocal>,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: IntegrationSubscriptionService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: 'connect.rpc.integration-subscriptions.install',
  })
  public async install(dto: RpcIntegrationSubscriptionInstallDto): Promise<{ }> {
    const business: BusinessModelLocal = await this.businessService.findOneById(dto.businessId);
    if (!business) {
      throw new NotFoundException(
        `Business with id '${dto.businessId}' not found'`,
      );
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integrationName,
    );
    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${dto.integrationName}' not found'`,
      );
    }

    // is allowed
    if (integration.allowedBusinesses && integration.allowedBusinesses.length &&
      integration.allowedBusinesses.indexOf(business._id) === -1) {
      throw new BadRequestException(
        `Third party integration is not allowed for current business`,
      );
    }

    // isn't excluded
    if (business && business.excludedIntegrations.length > 0
      && business.excludedIntegrations.indexOf(integration._id) > -1) {
        throw new BadRequestException(
          `Third party integration is not allowed for current business`,
        );
    }

    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.install(
      integration,
      business,
    );

    await this.integrationService.incrementInstallCounter(integration);

    return {
      installed: subscription.installed,
      name: subscription.integration.name,
      scopes: subscription.scopes,
    };
  }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: 'connect.rpc.integration-subscriptions.uninstall',
  })
  public async uninstall(dto: RpcIntegrationSubscriptionInstallDto): Promise<{ }> {
    const business: BusinessModelLocal = await this.businessService.findOneById(dto.businessId);
    if (!business) {
      throw new NotFoundException(
        `Business with id '${dto.businessId}' not found'`,
      );
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integrationName,
    );
    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${dto.integrationName}' not found'`,
      );
    }

    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.uninstall(
      integration,
      business,
    );

    return {
      installed: subscription.installed,
      name: subscription.integration.name,
    };
  }
}
