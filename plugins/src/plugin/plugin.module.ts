import { HttpModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelMongooseModels, ChannelsModule } from '@pe/channels-sdk';
import { BusinessSchema, BusinessSchemaName } from '../business/schemas';
import { BusinessService } from '@pe/business-kit';

import {
  PluginExportCommand,
  PluginCommandExportCommand,
  PluginFileExportCommand,
  PluginInstanceRegistryExportCommand,
  ShopSystemExportCommand,
} from './commands';
import { ShopSystemApiKeyConsumer } from './consumers';
import {
  PluginCommandController,
  PluginHttpController,
  PluginInstanceRegistryController,
  PluginsBusMessageController,
  ShopSystemApiKeyHttpController,
  ShopSystemHttpController,
} from './controllers';
import {
  PluginEventsProducer,
  PluginCommandEventsProducer,
  PluginFileEventsProducer,
  PluginInstanceRegistryEventsProducer,
  ShopSystemEventsProducer,
} from './producers';
import {
  PluginCommandSchema,
  PluginCommandSchemaName,
  PluginFileSchema,
  PluginFileSchemaName,
  PluginInstanceRegistrySchema,
  PluginInstanceRegistrySchemaName,
  PluginSchema,
  PluginSchemaName,
  ShopSystemSchema,
  ShopSystemSchemaName,
} from './schemas';
import {
  PluginCommandService,
  PluginInstanceRegistryService,
  PluginService,
  ShopSystemApiKeyService,
  ShopSystemService,
  ViewService,
} from './services';
import {
  ChannelEventListener,
  PluginEventListener,
  ShopSystemEventListener,
  ShopSystemApiKeyEventListener,
  ChannelSetEventListener,
} from './event-listeners';

@Module({
  controllers: [
    // Consumers
    ShopSystemApiKeyConsumer,
    // Controllers
    PluginCommandController,
    PluginHttpController,
    PluginInstanceRegistryController,
    PluginsBusMessageController,
    ShopSystemApiKeyHttpController,
    ShopSystemHttpController,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        ...ChannelMongooseModels,
        { name: BusinessSchemaName, schema: BusinessSchema },
        { name: PluginSchemaName, schema: PluginSchema },
        { name: PluginFileSchemaName, schema: PluginFileSchema },
        { name: ShopSystemSchemaName, schema: ShopSystemSchema },
        { name: PluginCommandSchemaName, schema: PluginCommandSchema },
        { name: PluginInstanceRegistrySchemaName, schema: PluginInstanceRegistrySchema },
      ],
    ),
    ChannelsModule,
  ],
  providers: [
    BusinessService,
    ViewService,
    Logger,
    PluginCommandService,
    PluginInstanceRegistryService,
    PluginService,
    ShopSystemApiKeyService,
    ShopSystemService,
    ChannelEventListener,
    ChannelSetEventListener,
    PluginEventListener,
    ShopSystemEventListener,
    ShopSystemApiKeyEventListener,
    PluginEventsProducer,
    PluginCommandEventsProducer,
    PluginFileEventsProducer,
    PluginInstanceRegistryEventsProducer,
    ShopSystemEventsProducer,
    PluginExportCommand,
    PluginCommandExportCommand,
    PluginFileExportCommand,
    PluginInstanceRegistryExportCommand,
    ShopSystemExportCommand,
  ],
})
export class PluginModule { }
