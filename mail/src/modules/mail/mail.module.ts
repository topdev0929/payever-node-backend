import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailAccessConfigSchemaName, MailSchemaName } from '../mongoose-schema/mongoose-schema.names';
import { BuilderMessagesConsumer } from './consumers';
import { AdminMailController, MailAccessController, MailByDomainController, MailController } from './controllers';
import { MailRabbitEventsProducer } from './producers';
import { MailAccessConfigSchema, MailSchema } from './schemas';
import { MailAccessConfigService, MailService, OnPublishConsumerService } from './services';

@Module({
  controllers: [
    AdminMailController,
    BuilderMessagesConsumer,
    MailAccessController,
    MailByDomainController,
    MailController,
  ],
  exports: [
    MailAccessConfigService,
    MailService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: MailAccessConfigSchemaName, schema: MailAccessConfigSchema },
        { name: MailSchemaName, schema: MailSchema },
      ],
    ),
  ],
  providers: [
    MailAccessConfigService,
    MailRabbitEventsProducer,
    MailService,
    OnPublishConsumerService,
  ],
})
export class MailModule {
}
