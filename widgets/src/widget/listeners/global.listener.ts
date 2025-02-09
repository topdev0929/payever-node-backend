import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { PushNotificationDto } from '../dto';
import { PushNotificationEnum } from '../enums/push-notification.enum';
import { GlobalEventsProducer } from '../producers';

@Injectable()
export class GlobalListener {

  constructor(
    private readonly globalEventsProducer: GlobalEventsProducer,
  ) { }

  @EventListener(PushNotificationEnum.send)
  private async sendPushNotification(pushNotification: PushNotificationDto): Promise<void> {

    await this.globalEventsProducer.sendPushNotification(pushNotification);
  }
}
