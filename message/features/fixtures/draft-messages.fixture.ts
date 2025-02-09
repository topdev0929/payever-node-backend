import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';

import { ChatDraftMessageDocument, ChatDraftMessage } from '../../src/message/submodules/draft-messages';
import { ID_OF_CUSTOMER_CHAT, ID_OF_CONTACT_DRAFT_MESSAGE, ID_OF_CONTACT } from './const';

class DraftMessagesFixture extends BaseFixture {
  protected readonly draftMessageModel: Model<ChatDraftMessageDocument> =
    this.application.get(getModelToken(ChatDraftMessage.name));
  public async apply(): Promise<void> {
    const draftMessagePrototype: ChatDraftMessage = {
      _id: ID_OF_CONTACT_DRAFT_MESSAGE,
      attachments: [],
      chat: ID_OF_CUSTOMER_CHAT,
      sender: ID_OF_CONTACT,
      type: 'text',

      content: '-content-',
      sentAt: null,
    };
    await this.draftMessageModel.create(draftMessagePrototype);
  }
}

export = DraftMessagesFixture;
