import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ApiCallEventEnum, MessageBusEventsEnum } from '../enum';
import { ApiCallModel } from '../models';
import { RabbitEventsProducer } from '../producer';

@Injectable()
export class SendRabbitEventApiCallListener {
  constructor(
    private readonly rabbitEventsProducer: RabbitEventsProducer,
  ) { }

  @EventListener(ApiCallEventEnum.apiCallCreated)
  public async handleApiCallCreated(
    apiCall: ApiCallModel,
  ): Promise<void> {
    await this.rabbitEventsProducer.sendApiCallEvent(
      MessageBusEventsEnum.apiCallCreated,
      apiCall,
    );
  }

  @EventListener(ApiCallEventEnum.apiCallUpdated)
  public async handleApiCallUpdated(
    apiCall: ApiCallModel,
  ): Promise<void> {
    await this.rabbitEventsProducer.sendApiCallEvent(
      MessageBusEventsEnum.apiCallUpdated,
      apiCall,
    );
  }
}
