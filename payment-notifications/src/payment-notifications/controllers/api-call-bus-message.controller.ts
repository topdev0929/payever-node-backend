import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiCallService } from '../services';
import { MessageBusChannelsEnum, MessageBusEventsEnum } from '../enums';
import { ApiCallDto } from '../dto';

@Controller()
export class ApiCallBusMessageController {
  constructor(
    private readonly apiCallService: ApiCallService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.paymentNotifications,
    name: MessageBusEventsEnum.apiCallCreated,
  })
  public async onApiCallCreatedEvent(data: ApiCallDto): Promise<void> {
    await this.apiCallService.create(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.paymentNotifications,
    name: MessageBusEventsEnum.apiCallMigrate,
  })
  public async onApiCallMigrateEvent(data: ApiCallDto): Promise<void> {
    await this.apiCallService.updateFromExport(data);
  }
}
