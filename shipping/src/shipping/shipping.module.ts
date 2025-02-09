import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModuleLocal } from '../business/business.module';
import { IntegrationSubscriptionEventsListener } from '../integration';
import { IntegrationModule } from '../integration/integration.module';
import { ThirdPartyService } from '../integration/services';
import { 
  ShippingOrderEsExportCommand, 
  ShippingOrderExportCommand,
  ShippingSettingExportCommand, 
  ShippingZoneExportCommand,
} from './commands';
import {
  AdminController,
  ShippingBoxController,
  ShippingOrderController,
  ShippingOriginController,
  ShippingSettingsController,
  ShippingZoneController,
} from './controllers';
import { ThirdPartyShippingDataBusMessageController } from './controllers/thirdparty-shipping-data-bus-message.controller';
import { CronManager, StuckTasksRemoverCron } from './cron';
import { ShippingEventsListener, ShippingOrderEventsListener } from './event-listeners';
import { ShippingOrderEventsProducer } from './producer';
import { InnerEventProducer } from './producer/inner.event.producer';
import {
  LocalDeliverySchema,
  LocalDeliverySchemaName,
  LocalPickUpSchema,
  LocalPickUpSchemaName,
  ShippingBoxSchema,
  ShippingBoxSchemaName,
  ShippingOrderSchema,
  ShippingOrderSchemaName,
  ShippingOriginSchema,
  ShippingOriginSchemaName,
  ShippingSettingSchema,
  ShippingSettingSchemaName,
  ShippingZoneSchema,
  ShippingZoneSchemaName,
} from './schemas';
import { ProductSchema, ProductSchemaName } from './schemas/product.schema';
import { ShippingTaskSchemaName, ShippingTaskSchema } from './schemas/shipping-task.schema';
import { SyncEventSchemaName, SyncEventSchema } from './schemas/sync-event.schema';
import {
  ShippingBoxService,
  ShippingOrderService,
  ShippingOrderElasticService,
  ShippingOriginService,
  ShippingSettingService,
  ShippingZoneService,
} from './services';
import { AdminService } from './services/admin.service';
import { OuterProcessService } from './services/outer-process.service';
import { SchedulerService } from './services/scheduler.service';
import { ShippingTaskService } from './services/shipping-task.service';
import { ShippingTriggerService } from './services/shipping-trigger.service';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { FoldersConfig, RulesOptions } from './config';
import { ShippingSettingEventsProducer } from './producer/shipping-setting-events.producer';
import { ShippingZoneEventsProducer } from './producer/shipping-zone-events.producer';

@Module({
  controllers: [
    ShippingOrderController,
    ShippingBoxController,
    ShippingOriginController,
    ShippingSettingsController,
    ShippingZoneController,
    ThirdPartyShippingDataBusMessageController,
    AdminController,
  ],
  exports: [
    CronManager,
    SchedulerService,
    ShippingTaskService,
    OuterProcessService,
    StuckTasksRemoverCron,
    ShippingTriggerService,
    ShippingOrderService,
    ShippingBoxService,
    ShippingOriginService,
    ShippingSettingService,
    ShippingZoneService,
    ShippingEventsListener,
  ],
  imports: [
    HttpModule,
    IntegrationModule,
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
    MongooseModule.forFeature([
      { name: ShippingBoxSchemaName, schema: ShippingBoxSchema },
      { name: ShippingOriginSchemaName, schema: ShippingOriginSchema },
      { name: ShippingSettingSchemaName, schema: ShippingSettingSchema },
      { name: ShippingOrderSchemaName, schema: ShippingOrderSchema },
      { name: ShippingZoneSchemaName, schema: ShippingZoneSchema },
      { name: LocalDeliverySchemaName, schema: LocalDeliverySchema },
      { name: LocalPickUpSchemaName, schema: LocalPickUpSchema },
      { name: ShippingTaskSchemaName, schema: ShippingTaskSchema },
      { name: SyncEventSchemaName, schema: SyncEventSchema },
      { name: ProductSchemaName, schema: ProductSchema },
    ]),
    forwardRef(() => BusinessModuleLocal),
  ],
  providers: [
    ShippingOrderEsExportCommand,
    ShippingOrderExportCommand,
    ShippingSettingExportCommand,
    ShippingZoneExportCommand,
    CronManager,
    ShippingTaskService,
    ShippingTriggerService,
    InnerEventProducer,
    SchedulerService,
    OuterProcessService,
    StuckTasksRemoverCron,
    IntegrationSubscriptionEventsListener,
    ShippingOrderEventsProducer,
    ShippingZoneEventsProducer,
    ShippingSettingEventsProducer,
    ShippingOrderService,
    ShippingOrderElasticService,
    ShippingBoxService,
    ShippingOriginService,
    ShippingSettingService,
    ShippingZoneService,
    ThirdPartyService,
    ShippingEventsListener,
    ShippingOrderEventsListener,
    AdminService,
  ],

})
export class ShippingModule { }
