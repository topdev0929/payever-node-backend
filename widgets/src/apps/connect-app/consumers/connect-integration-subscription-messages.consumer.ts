import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConnectIntegrationSubscriptionService } from '../services';
import { ConnectEventEnum } from '../enums';
import { ConnectIntegrationSubscriptionDeleteEventDto, ConnectIntegrationSubscriptionEventDto } from '../dtos';
import { ConnectIntegrationSubscriptionInterface } from '../interfaces';

@Controller()
export class ConnectIntegrationSubscriptionMessagesConsumer {
  constructor(
    private readonly connectIntegrationSubscriptionService: ConnectIntegrationSubscriptionService,
  ) { }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationSubscriptionCreated,
  })
  public async onConnectIntegrationSubscriptionCreated(data: ConnectIntegrationSubscriptionEventDto): Promise<void> {
    await this.upsertSubscription(data);
  }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationSubscriptionUpdated,
  })
  public async onConnectIntegrationSubscriptionUpdated(data: ConnectIntegrationSubscriptionEventDto): Promise<void> {
    await this.upsertSubscription(data);
  }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationSubscriptionExported,
  })
  public async onConnectIntegrationSubscriptionExported(data: ConnectIntegrationSubscriptionEventDto): Promise<void> {
    await this.upsertSubscription(data);
  }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationSubscriptionDeleted,
  })
  public async onConnectIntegrationSubscriptionDeleted(
    data: ConnectIntegrationSubscriptionDeleteEventDto,
  ): Promise<void> {
    await this.connectIntegrationSubscriptionService.deleteById(data.integrationSubscription);
  }

  private async upsertSubscription(data: ConnectIntegrationSubscriptionEventDto): Promise<void> {
    const subscription: ConnectIntegrationSubscriptionInterface = {
      businessId: data.business,
      installed: data.integrationSubscription.installed,
      integration: data.integrationSubscription.integration,
    };

    await this.connectIntegrationSubscriptionService.findOneAndUpdate(data.integrationSubscription._id, subscription);
  }
}
