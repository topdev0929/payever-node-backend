import { Module } from '@nestjs/common';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';
import { environment } from '../environments';
import { AbstractMessagingSchema } from '../message/submodules/platform';
import { RabbitChannelsEnum } from '../message';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessConfigSchemaFactory, AccessConfigSchemaName } from './schemas';
import { CommonController } from './controllers';
import { BuilderMessagesConsumerFactory } from './consumers';
import { AccessConfigService, CommonService, OnPublishConsumerService } from './services';

const applicationSchemaName: string = `Chat`;

@Module({
  controllers: [
    CommonController,
    BuilderMessagesConsumerFactory(ApplicationTypesEnum.Message, RabbitChannelsEnum.Message),
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: AccessConfigSchemaName,
        schema: AccessConfigSchemaFactory.create(applicationSchemaName),
      },
    ]),
    BuilderThemeModule.forRoot({
      applicationSchema: AbstractMessagingSchema as any,
      applicationSchemaName: applicationSchemaName,
      applicationType: ApplicationTypesEnum.Message,
      channel: RabbitChannelsEnum.Message,
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
