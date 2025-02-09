import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { ConnectRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { ConnectEventDto, IntegrationDto } from '../dto';

@Controller()
export class ConnectMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionCreated,
  })
  public async onConnectCreated(data: ConnectEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionUpdated,
  })
  public async onConnectUpdated(data: ConnectEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionExported,
  })
  public async onConnectExport(data: ConnectEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ConnectRabbitEventsEnum.ConnectIntegrationSubscriptionDeleted,
  })
  public async onConnectDeleted(data: {
    integrationSubscription: string;
  }): Promise<void> {
    await this.spotlightService.delete(
      data.integrationSubscription,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: ConnectEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.connectToSpotlightDocument(data), 
      data.integrationSubscription?.id,
    );
  } 

  private connectToSpotlightDocument(data: ConnectEventDto): SpotlightInterface {

    const integration: IntegrationDto = data.integrationSubscription?.integration;

    return {
      app: AppEnum.Connect,
      businessId: data.businessId,
      description: integration?.category,
      icon: integration?.categoryIcon,
      serviceEntityId: data.integrationSubscription?.id,
      title: integration?.name,
    };
  }
}
