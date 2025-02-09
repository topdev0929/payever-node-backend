import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiCallService } from '../services';
import { MessageBusChannelsEnum, MessageBusEventsEnum } from '../enums';
import { ActionApiCallEventDto, ApiCallEventDto } from '../dto';

@Controller()
export class ApiCallBusMessageController {
  constructor(
    private readonly apiCallService: ApiCallService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.ApiCallCreated,
  })
  public async onApiCallCreated(data: ApiCallEventDto): Promise<void> {
    await this.apiCallService.createOrUpdateApiCallFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.ApiCallUpdated,
  })
  public async onApiCallUpdated(data: ApiCallEventDto): Promise<void> {
    await this.apiCallService.createOrUpdateApiCallFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.ApiCallMigrate,
  })
  public async onApiCallMigrate(data: ApiCallEventDto): Promise<void> {
    await this.apiCallService.createOrUpdateApiCallFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.ActionApiCallCreated,
  })
  public async onActionApiCallCreated(data: ActionApiCallEventDto): Promise<void> {
    await this.apiCallService.createOrUpdateActionApiCallFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.ActionApiCallMigrate,
  })
  public async onActionApiCallMigrate(data: ActionApiCallEventDto): Promise<void> {
    await this.apiCallService.createOrUpdateActionApiCallFromEvent(data);
  }
}
