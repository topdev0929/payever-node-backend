import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService, BusinessModel } from '@pe/business-kit';
import { ConnectionService, IntegrationService } from '../services';
import { IntegrationModel } from '../models';
import { IntegrationConnectedRmqMessageDto, IntegrationUninstalledMessageDto } from '../dtos';
import { plainToClass } from 'class-transformer';
import { ConnectionRabbitEventsEnum } from '../enums/connection-rabbit.enum';
import { RabbitChannelsEnum } from '../../affiliates/enums';

@Controller()
export class ConnectionBusMessageController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly connectionService: ConnectionService,
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: ConnectionRabbitEventsEnum.ThirdPartyIntegrationConnected,
  })
  public async onIntegrationConnected(dto: any): Promise<void> {
    const data: IntegrationConnectedRmqMessageDto = plainToClass(IntegrationConnectedRmqMessageDto, dto);

    if (!data.connection || data.integration.category !== 'payments') {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(data.business.id);

    const integration: IntegrationModel =
      await this.integrationService.findOneByName(data.integration.name);

    if (!integration || !business) {
      return;
    }

    await this.connectionService.createConnection(business as any, integration, data.integration.name, data.connection);
  }

  /* tslint:disable */
  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: ConnectionRabbitEventsEnum.ThirdPartyIntegrationConnectionExported,
  })
  public async onIntegrationExported(dto: any): Promise<void> {
    const data: IntegrationConnectedRmqMessageDto = plainToClass(IntegrationConnectedRmqMessageDto, dto);
    if (data.integration.category !== 'payments') {
      return;
    }

    const integration: IntegrationModel =
      await this.integrationService.findOneByName(data.integration.name);
    if (!integration) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(data.business.id);
    await this.connectionService.createConnection(business as any, integration, data.integration.name, data.connection);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: ConnectionRabbitEventsEnum.ThirdPartyIntegrationDisconnected,
  })
  public async onIntegrationDisconnected(dto: any): Promise<void> {
    const data: IntegrationConnectedRmqMessageDto = plainToClass(IntegrationConnectedRmqMessageDto, dto);
    if (data.integration.category !== 'payments') {
      return;
    }
    const business: BusinessModel = await this.businessService.findOneById(data.business.id);
    await this.connectionService.removeConnection(business as any, data.connection.id);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: ConnectionRabbitEventsEnum.ConnectThirdPartyUninstalled,
  })
  public async onIntegrationUninstalled(dto: any): Promise<void> {
    const data: IntegrationUninstalledMessageDto = plainToClass(IntegrationUninstalledMessageDto, dto);
    if (data.category !== 'payments') {
      return;
    }
    const business: BusinessModel = await this.businessService.findOneById(data.businessId);

    if (!business) {
      return;
    }

    await this.connectionService.removeConnectionsByIntegrationName(business as any, data.name);
  }
}
