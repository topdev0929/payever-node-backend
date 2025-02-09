import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '@pe/business-kit';

import { CategoryExistsConstraint } from './constraints';
import {
  ConnectBusMessageController,
} from './consumers';
import {
  AdminAppsController,
  AppsController,
  AppSubscriptionsController,
  EventSubscriptionsController,
} from './controllers';
import { MessageBusChannelsEnum } from './enums';
import {
  AppEventsProducer,
  AppSubscriptionEventsProducer,
  EventSubscriptionEventsProducer,
} from './producers';
import {
  AppSchema,
  AppSchemaName,
  AppSubscriptionSchema,
  AppSubscriptionSchemaName,
  CategorySchema,
  CategorySchemaName,
  EventSubscriptionSchema,
  EventSubscriptionSchemaName,
} from './schemas';
import { AppService, AppSubscriptionService, EventSubscriptionService, CategoryService } from './services';
import { AppVoter } from './voters';

@Module({
  controllers: [
    // Consumers
    ConnectBusMessageController,
    // Controllers
    AdminAppsController,
    AppsController,
    AppSubscriptionsController,
    EventSubscriptionsController,
  ],
  exports: [],
  imports: [
    MongooseModule.forFeature([
      {
        name: AppSchemaName,
        schema: AppSchema,
      },
      {
        name: AppSubscriptionSchemaName,
        schema: AppSubscriptionSchema,
      },
      {
        name: CategorySchemaName,
        schema: CategorySchema,
      },
      {
        name: EventSubscriptionSchemaName,
        schema: EventSubscriptionSchema,
      },
    ]),
    BusinessModule.forRoot({
      rabbitChannel: MessageBusChannelsEnum.apps,
    }),
  ],
  providers: [
    // Constraints
    CategoryExistsConstraint,
    // Producers
    AppEventsProducer,
    AppSubscriptionEventsProducer,
    EventSubscriptionEventsProducer,
    // Services
    AppService,
    AppSubscriptionService,
    CategoryService,
    EventSubscriptionService,
    // Voters
    AppVoter,
  ],
})
export class AppsModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
