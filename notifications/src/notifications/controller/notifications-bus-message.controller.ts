/* eslint-disable no-bitwise */
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { CancelNotificationDto, CreateNotificationDto } from '../dto';
import { RabbitChannel } from '../enums/rabbit-channel.enum';
import { EventsGateway } from '../gateway/events.gateway';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from '../services';
import { MessageNameEnum } from '../enums/message-name.enum';

@Controller()
export class NotificationsBusMessageController {
  constructor(
    private notificationService: NotificationService,
    private eventsGateway: EventsGateway,
    private logger: Logger,
  ) { }

  private static getNotificationHash(notification: CreateNotificationDto): string {
    const stringified: string = JSON.stringify(notification);
    let hash: number = 0;
    let char: number;
    if (stringified.length === 0) {
      return hash.toString();
    }

    for (let i: number = 0; i < stringified.length; i++) {
      char = stringified.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }

    return hash.toString();
  }

  @MessagePattern({
    channel: RabbitChannel.NotificationsNotify,
    name: 'notifications.event.notification.notify',
  })
  public async createChannelSetsForEnabledByDefaultChannels(
    dto: CreateNotificationDto & { hash: string },
  ): Promise<void> {
    dto.hash = NotificationsBusMessageController.getNotificationHash(dto);
    this.logger.log(dto);
    await validate(dto);

    const existedNotifications: NotificationModel[] = await this.notificationService.findByHash(dto.hash);
    if (existedNotifications.length) {
      this.logger.log(`Notification with hash "${dto.hash}" exists, skipping`);

      return;
    }

    const notification: NotificationModel = await this.notificationService.create(dto);
    await this.eventsGateway.send(notification);
  }

  @MessagePattern({
    channel: RabbitChannel.Notifications,
    name: 'notifications.event.notification.cancel',
  })
  public async cancelNotifications(
    dto: CancelNotificationDto,
  ): Promise<void> {
    this.logger.log(dto);
    await validate(dto);

    const ids: string[] = await this.notificationService.deleteByDto(dto);
    await this.eventsGateway.emit(MessageNameEnum.NOTIFICATIONS_CANCELED, ids);
  }
}
