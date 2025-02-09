import { Module } from '@nestjs/common';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';
import { environment } from '../environments';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessConfigSchemaFactory, AccessConfigSchemaName } from './schemas';
import { CommonController } from './controllers';
import { BuilderMessagesConsumerFactory } from './consumers';
import { AccessConfigService, CommonService, OnPublishConsumerService } from './services';
import { UserMediaSchema, UserMediaSchemaName } from '../studio/schemas';
import { RabbitChannelsEnum } from '../studio/enums';

@Module({
  controllers: [
    CommonController,
    BuilderMessagesConsumerFactory(ApplicationTypesEnum.Studio, RabbitChannelsEnum.Studio),
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: AccessConfigSchemaName,
        schema: AccessConfigSchemaFactory.create(UserMediaSchemaName),
      },
    ]),
    BuilderThemeModule.forRoot({
      applicationSchema: UserMediaSchema,
      applicationSchemaName: UserMediaSchemaName,
      applicationType: ApplicationTypesEnum.Studio,
      channel: RabbitChannelsEnum.Studio,
      redisUrl: environment.redis.url,
    }),
  ],
  providers: [
    AccessConfigService,
    CommonService,
    OnPublishConsumerService,
  ],
})
export class ApplicationBuilderThemeModule { }
