import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConnectIntegrationService } from '../services';
import { ConnectEventEnum } from '../enums';
import { ConnectIntegrationDeleteEventDto, ConnectIntegrationEventDto } from '../dtos';

@Controller()
export class ConnectIntegrationMessagesConsumer {
  constructor(
    private readonly connectIntegrationService: ConnectIntegrationService,
  ) { }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationCreated,
  })
  public async onConnectIntegrationCreated(data: ConnectIntegrationEventDto): Promise<void> {
    await this.connectIntegrationService.findOneAndUpdate(data);
  }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationUpdated,
  })
  public async onConnectIntegrationUpdated(data: ConnectIntegrationEventDto): Promise<void> {
    await this.connectIntegrationService.findOneAndUpdate(data);
  }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationExported,
  })
  public async onConnectIntegrationExported(data: ConnectIntegrationEventDto): Promise<void> {
    await this.connectIntegrationService.findOneAndUpdate(data);
  }

  @MessagePattern({
    name: ConnectEventEnum.ConnectIntegrationDeleted,
  })
  public async onConnectIntegrationDeleted(data: ConnectIntegrationDeleteEventDto): Promise<void> {
    await this.connectIntegrationService.deleteById(data.integration);
  }
}
