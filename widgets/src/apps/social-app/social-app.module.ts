import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSetBusMessageConsumer, SocialMessageConsumer } from './consumers';
import { ChannelSetSchema, ChannelSetSchemaName, SocialPostSchema, SocialPostSchemaName } from './schemas';
import { ChannelSetService, SocialPostService } from './services';

@Module({
  controllers: [
    ChannelSetBusMessageConsumer,
    SocialMessageConsumer,
  ],
  exports: [
    ChannelSetService,
    SocialPostService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: ChannelSetSchemaName, schema: ChannelSetSchema },
        { name: SocialPostSchemaName, schema: SocialPostSchema },
      ],
    ),
  ],
  providers: [
    ChannelSetService,
    SocialPostService,
  ],
})
export class SocialModule { }
