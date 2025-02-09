import { HttpModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { MediaSdkModule } from '@pe/media-sdk';
import { BusinessModuleLocal } from '../business';
import { BlogModule } from '../blog';
import { environment } from '../environments';
import {
  CommentSchemaName,
} from '../mongoose-schema/mongoose-schema.names';
import {
  CommentController,
  BuilderApiController,
} from './controllers';
import { CommentRabbitEventsProducer } from './producers';
import { CommentSchema } from './schemas';
import { CommentService } from './services';
import { MessageBusChannelsEnum } from '../blog/enums';

@Module({
  controllers: [
    CommentController,
    BuilderApiController,
  ],
  exports: [
    CommentService,
  ],
  imports: [
    Logger,
    HttpModule,
    BusinessModuleLocal,
    BlogModule,
    MongooseModule.forFeature([
      { name: CommentSchemaName, schema: CommentSchema },
    ]),
    MediaSdkModule,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.blog,
      consumerModels: [CommonModelsNamesEnum.LanguageModel],
      rsaPath: environment.rsa,
    }),
  ],
  providers: [
    CommentRabbitEventsProducer,
    CommentService,
  ],
})
export class CommentModule { }
