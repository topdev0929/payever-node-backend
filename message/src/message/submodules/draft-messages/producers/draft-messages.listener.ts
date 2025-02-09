import { FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';

import {
  AbstractChatMessageDocument,
  ChatTextMessage,
  ChatTextMessageDocument,
} from '../../platform';
import { EventOriginEnum } from '../../../enums';
import { InternalEventCodesEnum } from '../../../../common';
import { ChatDraftsMessageService } from '../services';
import { ChatDraftMessageDocument } from '../schemas';

@Injectable()
export class DraftMessagesListeners {
  constructor(
    private readonly chatDraftsMessageService: ChatDraftsMessageService,
  ) { }

  @EventListener(InternalEventCodesEnum.MessagesCreated)
  public async onNewMessagesCreated(
    messages: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const filter: FilterQuery<ChatDraftMessageDocument>['$or'] = messages
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .filter(ChatTextMessage.isTypeOf)
      .map((message: ChatTextMessageDocument) => ({
        chat: message.chat,
        sender: message.sender,
      }));
    if (!filter.length) {
      return;
    }
    await this.chatDraftsMessageService.deleteByFilter({ $or: filter });
  }
}
