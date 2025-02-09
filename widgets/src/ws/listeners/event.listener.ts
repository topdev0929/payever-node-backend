import { Injectable } from '@nestjs/common';
import { WidgetDataUpdatedEventsEnum } from '../../apps/message-app/enums';
import { ChatModel } from '../../apps/message-app/models';
import { EventsGateway } from '../events.gateway';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class EventListenerService {

  constructor(
    private readonly eventGateway: EventsGateway,
  ) { }

  @EventListener(WidgetDataUpdatedEventsEnum.MessageDataUpdated)
  public async onMessageDataUpdated(
    chats: ChatModel[],
  ): Promise<void> {
    await this.eventGateway.sendBusinessMessageDataUpdatedEvent(chats);
  }
}
