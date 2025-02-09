import { DynamicModule, HttpModule, Module, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '@pe/business-kit';
import {
  IntegrationModule as KitIntegrationModule,
  SynchronizerModule as KitSynchronizationModule,
} from '@pe/synchronizer-kit';
import { environment } from '../environments';
import { MongooseSchemas } from './config';
import {
  AdminSchedulerController,
  CollectionsBusMessageController,
  InventoryBusMessageController,
  ProductFilesBusMessageController,
  ProductsBusMessageController,
  SynchronizationInventoryBusMessageController,
  SynchronizationInventoryController,
  SynchronizationProductsController,
  ThirdPartyBulkProductsBusMessageController,
  ThirdPartyInventoryBusMessageController,
  ThirdPartyProductsBusMessageController,
} from './controllers';
import { CronManager, StuckTasksRemoverCron } from './cron';
import { SynchronizationRemoverListener } from './event-listener';
import { InnerEventProducer, OuterEventProducer } from './producers';
import { MailerEventProducer } from './producers/mailer.event.producer';
import {
  InnerProcessService,
  OuterProcessService,
  SchedulerService,
  SynchronizationService,
  SynchronizationTaskItemService,
  SynchronizationTaskService,
  SynchronizationTriggerService,
} from './services';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';

@Module({
  controllers: [
    // Bus Controllers
    InventoryBusMessageController,
    ProductsBusMessageController,
    SynchronizationInventoryBusMessageController,
    ThirdPartyInventoryBusMessageController,
    ThirdPartyProductsBusMessageController,
    ProductFilesBusMessageController,
    CollectionsBusMessageController,
    ThirdPartyBulkProductsBusMessageController,
    // Merchant Controllers
    SynchronizationInventoryController,
    SynchronizationProductsController,
    // Admin Controllers
    AdminSchedulerController,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(MongooseSchemas),
    BusinessModule,
    KitIntegrationModule,
    KitSynchronizationModule,
    MigrationModule,
  ],
  providers: [
    CronManager,
    StuckTasksRemoverCron,
    InnerProcessService,
    OuterProcessService,
    SchedulerService,
    SynchronizationService,
    SynchronizationTriggerService,
    SynchronizationTaskService,
    InnerEventProducer,
    OuterEventProducer,
    MailerEventProducer,
    SynchronizationRemoverListener,
    SynchronizationTaskItemService,
  ],
})
export class SynchronizerModule {
  public static forRoot(): DynamicModule {
    const controllers: Array<Type<any>> = [];

    if (environment.rabbitProductSyncQueueName) {
      controllers.push(ThirdPartyBulkProductsBusMessageController);
    }

    return {
      controllers: [
        ...controllers,
      ],
      module: SynchronizerModule,
    };

  }
}
