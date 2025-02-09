import { HttpModule, Module } from '@nestjs/common';
import { EventDispatcherModule } from '@pe/nest-kit';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule, BusinessSchemaFactory } from '@pe/business-kit';
import { NotificationsBusMessageController, NotificationsController } from './controller';
import { BusinessEventListener } from './event-listeners';
import { OldNotificationsRemover } from './cron';
import { EventsGateway } from './gateway/events.gateway';
import { NotificationSchema } from './schemas/notification.schema';
import { SubscriptionGroupSchema } from './schemas/subscription-group.schema';
import { NotificationService } from './services';
import { RabbitChannel } from './enums/rabbit-channel.enum';

@Module({
  controllers: [
    NotificationsController,
    NotificationsBusMessageController,
  ],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchemaFactory.create(null),
      rabbitChannel: RabbitChannel.Notifications,
    }),
    EventDispatcherModule,
    MongooseModule.forFeature(
      [
        { name: 'Notification', schema: NotificationSchema },
        { name: 'SubscriptionGroup', schema: SubscriptionGroupSchema },
      ],
    ),
  ],
  providers: [
    EventsGateway,
    NotificationService,
    OldNotificationsRemover,
    BusinessEventListener,
  ],
})
export class NotificationsModule { }
