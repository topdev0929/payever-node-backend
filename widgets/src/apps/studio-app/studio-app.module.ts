import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessMediaSchema, BusinessMediaSchemaName } from './schemas';
import { BusinessMediaService } from './services';
import { StudioMessagesConsumer } from './consumers';
import { LastMediaController } from './controllers';

@Module({
  controllers: [
    StudioMessagesConsumer,
    LastMediaController,
  ],
  exports: [
    BusinessMediaService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: BusinessMediaSchemaName, schema: BusinessMediaSchema },
      ],
    ),
  ],
  providers: [
    BusinessMediaService,
  ],
})
export class StudioAppModule { }
