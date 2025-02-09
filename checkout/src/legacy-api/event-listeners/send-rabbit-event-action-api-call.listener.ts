import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { LegacyApiEventEnum, MessageBusEventsEnum } from '../enum';
import { ActionApiCallModel } from '../models';
import { LegacyApiEventsProducer } from '../producer';

@Injectable()
export class SendRabbitEventActionApiCallListener {
  constructor(
    private readonly legacyApiEventsProducer: LegacyApiEventsProducer,
  ) { }

  @EventListener(LegacyApiEventEnum.actionApiCallCreated)
  public async handleActionApiCallCreated(
    actionApiCall: ActionApiCallModel,
  ): Promise<void> {
    await this.legacyApiEventsProducer.sendActionApiCallEvent(
      MessageBusEventsEnum.actionApiCallCreated,
      actionApiCall,
    );
  }
}
