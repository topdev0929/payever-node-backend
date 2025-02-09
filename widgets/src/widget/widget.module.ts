import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessService } from '@pe/business-kit';
import { RedisModule } from '@pe/nest-kit';
import { BusinessSchema } from '../business/schemas';
import { MongooseModel } from '../common';
import { environment } from '../environments';
import { UserSchema } from '../user/schemas';
import { UserService } from '../user/services';
import {
  AdminController,
  WidgetController,
  WidgetInstallationController,
  WidgetTutorialController,
} from './controller';
import { AdminPushNotificationController } from './controller/admin-push-notification.controller';
import { WidgetBusMessageController } from './controller/widget-bus-message.controller';
import { GlobalListener, WidgetInstallationEventsListener, WidgetTutorialEventsListener } from './listeners';
import { GlobalEventsProducer } from './producers/global-events.producer';
import {
  OnboardingAppInstallationSchema,
  PendingAppInstallationSchema,
  PushNotificationSchema,
  WidgetInstallationSchema,
  WidgetSchema,
  WidgetTutorialSchema,
} from './schemas';
import { PushNotificationService, WidgetInstallationService, WidgetService, WidgetTutorialService } from './services';
import { IsUniqueWidgetTypeConstraint } from './validators';

@Module({
  controllers: [
    WidgetBusMessageController,
    WidgetController,
    WidgetInstallationController,
    WidgetTutorialController,
    AdminController,
    AdminPushNotificationController,
  ],
  exports: [
    // Services
    UserService,
    WidgetInstallationService,
    WidgetTutorialService,
    WidgetService,
  ],
  imports: [
    HttpModule,
    RedisModule.forRoot(environment.redis),
    MongooseModule.forFeature(
      [
        { name: MongooseModel.Business, schema: BusinessSchema },
        { name: MongooseModel.User, schema: UserSchema },
        { name: MongooseModel.Widget, schema: WidgetSchema },
        { name: MongooseModel.WidgetInstallation, schema: WidgetInstallationSchema },
        { name: MongooseModel.WidgetTutorial, schema: WidgetTutorialSchema },
        { name: MongooseModel.PendingAppInstallation, schema: PendingAppInstallationSchema },
        { name: MongooseModel.OnboardingAppInstallation, schema: OnboardingAppInstallationSchema },
        { name: MongooseModel.PushNotification, schema: PushNotificationSchema },
      ],
    ),
  ],
  providers: [
    // Producers
    GlobalEventsProducer,
    // Services
    BusinessService,
    UserService,
    WidgetService,
    WidgetInstallationService,
    WidgetTutorialService,
    PushNotificationService,
    IsUniqueWidgetTypeConstraint,
    WidgetInstallationEventsListener,
    WidgetTutorialEventsListener,
    GlobalListener,
  ],
})
export class WidgetModule { }
