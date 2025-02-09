import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ChatTemplateSchemaName,
  ChatTemplateSchema,
  ChatMessageTemplateSchemaName,
  ChatMessageTemplateSchema,
} from './schemas';

import {
  ChatMessageTemplateService,
  ChatTemplateService,
  TemplatesSynchronizationService,
} from './services';
import { AppChannelsModule } from '../messaging/app-channels';
import { GroupChatsModule } from '../messaging/group-chats';
import { PlatformModule } from '../platform';

@Module({
  exports: [
    ChatTemplateService,
    ChatMessageTemplateService,
    TemplatesSynchronizationService,
  ],
  imports: [
    PlatformModule,
    AppChannelsModule,
    GroupChatsModule,
    MongooseModule.forFeature([{
      name: ChatTemplateSchemaName,
      schema: ChatTemplateSchema,
    }, {
      name: ChatMessageTemplateSchemaName,
      schema: ChatMessageTemplateSchema,
    }]),
  ],
  providers: [
    ChatTemplateService,
    ChatMessageTemplateService,
    TemplatesSynchronizationService,
  ],
})
export class TemplatesModule { }
