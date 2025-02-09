import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business/business.module';
import { IntegrationModule } from '../integration/integration.module';
import {
  BusinessSchema,
  BusinessSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  ChannelSetSlugSchema,
  ChannelSetSlugSchemaName,
} from '../mongoose-schema';
import {
  ChannelSetByBusinessExportCommand,
  ChannelSetExportCommand,
} from './commands';
import {
  AdminChannelSetController,
  ChannelSetBusMessageController,
  ChannelSetCheckoutController,
  ChannelSetController,
  SlugController,
} from './controllers';
import { ChannelSetEventsListener } from './event-listeners';
import { ChannelSetRabbitProducer } from './producers';
import { ChannelSetService, RedirectUrlGenerator } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [
    AdminChannelSetController,
    ChannelSetBusMessageController,
    ChannelSetCheckoutController,
    ChannelSetController,
    SlugController,
  ],
  exports: [
    ChannelSetRabbitProducer,
    ChannelSetService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    forwardRef(() => CommonModule),
    IntegrationModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: ChannelSetSchemaName,
        schema: ChannelSetSchema,
      },
      {
        name: ChannelSetSlugSchemaName,
        schema: ChannelSetSlugSchema,
      },
    ]),
  ],
  providers: [
    ChannelSetByBusinessExportCommand,
    ChannelSetExportCommand,
    ChannelSetEventsListener,
    ChannelSetRabbitProducer,
    ChannelSetService,
    RedirectUrlGenerator,
  ],
})
export class ChannelSetModule { }
