import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalBusinessModule } from '../business/business.module';
import { IntegrationModule } from '../integration/integration.module';
import { ChannelSetBusMessageConsumer } from './consumers';
import { ChannelSetEventsListener } from './event-listeners';
import { ChannelSetSchema, ChannelSetSchemaName } from './schemas';
import { ChannelSetService } from './services';

@Module({
  controllers: [
    ChannelSetBusMessageConsumer,
  ],
  exports: [
    ChannelSetService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: ChannelSetSchemaName,
        schema: ChannelSetSchema,
      },
    ]),
    forwardRef(() => LocalBusinessModule),
    forwardRef(() => IntegrationModule),
  ],
  providers: [
    ChannelSetService,
    ChannelSetEventsListener,
  ],
})
export class ChannelSetModule { }
