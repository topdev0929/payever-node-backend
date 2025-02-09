import {
  AbstractChatMessage,
  ChatTextMessage,
  ChatBoxMessage,
  ChatTemplateMessage,
} from '../../message/submodules/platform';
import { MessageHttpResponseDto } from '../dto/outgoing';
import { MessagingTransformerOptionsInterface } from '../interfaces';
import { ChatEventMessage } from '../submodules/platform/schemas/message/event';

export function messageToResponseDto(
  message: AbstractChatMessage,
  options: MessagingTransformerOptionsInterface = {
    forUser: null,
  },
): MessageHttpResponseDto {
  if (ChatTextMessage.isTypeOf(message)) {
    return {
      _id: message._id,
      attachments: message.attachments,
      chat: message.chat,
      content: message.content,
      contentPayload: message.contentPayload,
      contentType: message.contentType,
      data: message.data,
      deletedForUsers: message.deletedForUsers,
      editedAt: message.editedAt,
      forwardFrom: message.forwardFrom,
      isCachRead: message.isCachRead,
      mentions: message.mentions,
      readBy: message.readBy,
      replyTo: message.replyTo,
      replyToContent: message.replyToContent,
      sender: message.sender,
      sentAt: message.sentAt,
      status: message.status,
      template: message.template,
      type: message.type,

      createdAt: message.createdAt,
      updatedAt: message.createdAt,
    };
  } else if (ChatBoxMessage.isTypeOf(message)) {
    return {
      _id: message._id,
      chat: message.chat,
      data: message.data,
      editedAt: message.editedAt,
      forwardFrom: message.forwardFrom,
      interactive: message.interactive,
      isCachRead: message.isCachRead,
      readBy: message.readBy,
      sender: message.sender,
      sentAt: message.sentAt,
      status: message.status,
      template: message.template,
      type: message.type,

      createdAt: message.createdAt,
      updatedAt: message.createdAt,
    };
  } else if (ChatTemplateMessage.isTypeOf(message)) {
    return {
      _id: message._id,
      chat: message.chat,
      components: message.components,
      data: message.data,
      editedAt: message.editedAt,
      isCachRead: message.isCachRead,
      readBy: message.readBy,
      sender: message.sender,
      sentAt: message.sentAt,
      status: message.status,
      template: message.template,
      type: message.type,

      createdAt: message.createdAt,
      updatedAt: message.createdAt,
    };
  } else if (ChatEventMessage.isTypeOf(message)) {
    return {
      _id: message._id,
      chat: message.chat,
      createdAt: message.createdAt,
      data: message.data,
      editedAt: message.editedAt,
      eventName: message.eventName,
      isCachRead: message.isCachRead,
      readBy: message.readBy,
      sender: message.sender,
      sentAt: message.sentAt,
      status: message.status,
      template: message.template,
      type: message.type,
      updatedAt: message.createdAt,
    };
  }

  throw new Error(`Unknown message type '${message.type}'`);
}
