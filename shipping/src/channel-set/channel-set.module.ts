import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { BusinessModuleLocal } from '../business/business.module';
import { IntegrationModule } from '../integration/integration.module';
import { ShippingModule } from '../shipping/shipping.module';
import { ChannelSetBusMessageController, ChannelSetController } from './controllers';
import { ChannelSetEventsListener, BuilderIntegrationListener } from './event-listeners';
import { ChannelSetSchema, ChannelSetSchemaName } from './schemas';
import { ChannelSetService } from './services';

@Module({
  controllers: [
    ChannelSetController,
    ChannelSetBusMessageController,
  ],
  exports: [
    ChannelSetService,
  ],
  imports: [
    HttpModule,
    NotificationsSdkModule,
    MongooseModule.forFeature([
      {
        name: ChannelSetSchemaName,
        schema: ChannelSetSchema,
      },
    ]),
    BusinessModuleLocal,
    IntegrationModule,
    ShippingModule,
  ],
  providers: [
    ChannelSetService,
    ChannelSetEventsListener,
    BuilderIntegrationListener,
  ],
})
export class ChannelSetModule { }
