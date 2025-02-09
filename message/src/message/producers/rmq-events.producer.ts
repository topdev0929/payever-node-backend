import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import { RMQEventsEnum } from '../enums';
import { CustomerChat } from '../submodules/messaging/customer-chat';
import {
  AbstractMessagingDocument,
  ContactsService,
  ContactDocument,
  CommonMessagingService,
  AbstractMessaging,
  ChatMember,
} from '../submodules/platform';

@Injectable()
export class RMQEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
    private readonly contactService: ContactsService,
    private readonly chatService: CommonMessagingService,
  ) { }

  public async produceWidgetDataForContactUpdate(contact: ContactDocument, event: RMQEventsEnum): Promise<void> {
    const chats: AbstractMessagingDocument[] = await this.chatService.find({ contact: contact._id }).exec();

    for (const chat of chats) {
      await this.produceWidgetDataUpdatedEvent(chat, event);
    }
  }

  public async produceWidgetDataUpdatedEvent(chat: AbstractMessagingDocument, event: RMQEventsEnum): Promise<void> {
    const contact: ContactDocument =
      CustomerChat.isTypeOf(chat) ? await this.contactService.findById(chat.contact) : null;

    await this.rabbitMqClient.send(
      {
        channel: event,
        exchange: 'async_events',
      },
      {
        name: event,
        payload: {
          businessId: AbstractMessaging.hasBusiness(chat) ? chat.business : null,
          id: chat.id,
          lastMessage: chat.lastMessages ? chat.lastMessages[0] : null,
          lastSeen: contact?.lastSeen,
          members: chat.members,
          name: chat.title,
          photo: chat?.photo,
          salt: chat.salt,
          type: chat.type,
        },
      },
    );
  }

  public async produceWidgetMemberUpdatedEvent(
    chat: AbstractMessagingDocument,
    member: ChatMember,
    event: RMQEventsEnum): Promise<void> {
    await this.rabbitMqClient.send(
      {
        channel: event,
        exchange: 'async_events',
      },
      {
        name: event,
        payload: {
          chatId: chat.id,
          member: member,
        },
      },
    );
  }
}
