import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSetRemoverListener } from './event-listeners';
import { ChannelSetSchema, ChannelSetSchemaName } from '@pe/channels-sdk';

@Module({
  controllers: [],
  exports: [
  ],
  imports: [

    MongooseModule.forFeature([
      { name: ChannelSetSchemaName, schema: ChannelSetSchema },
    ]),
  ],
  providers: [
    ChannelSetRemoverListener,
  ],
})
export class ChannelModuleLocal {
}
