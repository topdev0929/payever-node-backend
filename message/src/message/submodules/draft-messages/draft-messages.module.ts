import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatDraftMessageSchema, ChatDraftMessage } from './schemas';
import { ChatDraftsMessageService } from './services';
import { DraftMessagesListeners } from './producers';
import { AbstractChatMessage, AbstractChatMessageSchema } from '../platform';

@Module({
  exports: [
    ChatDraftsMessageService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatDraftMessage.name,
        schema: ChatDraftMessageSchema,
      },
      {
        name: AbstractChatMessage.name,
        schema: AbstractChatMessageSchema,
      },
    ]),
  ],
  providers: [
    ChatDraftsMessageService,
    DraftMessagesListeners,
  ],
})
export class DraftMessagesModule { }
