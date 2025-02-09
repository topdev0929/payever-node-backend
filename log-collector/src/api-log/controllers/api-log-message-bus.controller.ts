import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ApiLogService } from '../services';
import { MessageBusChannelsEnum, RabbitMessagesEnum } from '../enums';
import { ApiLogInterface } from '../interface';

@Controller()
export class ApiLogMessageBusController {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsLogCollector,
    name: RabbitMessagesEnum.apiLogsEventCalled,
  })
  public async onApiLogCollected(log: ApiLogInterface): Promise<void> {
    await this.apiLogService.create(log);
  }
}
