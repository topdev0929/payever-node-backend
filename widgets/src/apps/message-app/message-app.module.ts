import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule } from '@pe/nest-kit';
import { ChatMessagesConsumer } from './consumers';
import { ChatSchemaName, ChatSchema } from './schemas';
import { MessageService } from './services';

@Module({
  controllers: [
    ChatMessagesConsumer,
  ],
  exports: [
    MessageService,
  ],
  imports: [
    EventDispatcherModule,
    MongooseModule.forFeature(
      [
        { name: ChatSchemaName, schema: ChatSchema },
      ],
    ),
  ],
  providers: [
    MessageService,
  ],
})
export class MessageAppModule { }
