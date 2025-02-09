/**
 * @ref third-party/messenger/src/messenger/enum/stomp-topics.enum.ts
 */

export enum StompTopicsEnum {
  TpmFirstMessageCreated = 'third-party-messenger.event.first-message.created',

  TpmContactCreated = 'third-party-messenger.event.contact.created',
  TpmContactUpdated = 'third-party-messenger.event.contact.updated',
  TpmContactDeleted = 'third-party-messenger.event.contact.deleted',
  TpmContactStatus = 'third-party-messenger.event.contact.status',
  TpmChatCreated = 'third-party-messenger.event.chat.created',
  TpmChatUpdated = 'third-party-messenger.event.chat.updated',
  TpmChatDeleted = 'third-party-messenger.event.chat.deleted',
  TpmChatSync = 'third-party-messenger.event.chat.sync',
  TpmClientTyping = 'third-party-messenger.event.chat.typing',
  TpmUserActivity = 'third-party-messenger.event.user.activity',
  TpmMessageCreated = 'third-party-messenger.event.message.created',
  TpmMessageUpdated = 'third-party-messenger.event.message.updated',
  TpmMessageDeleted = 'third-party-messenger.event.message.deleted',
  TpmMessagePin = 'third-party-messenger.event.message.pin',
  TpmMessageUnpin = 'third-party-messenger.event.message.unpin',
  TpmUserOnlineRefresh = 'third-party-messenger.event.user-online.refresh',

  MessageContactCreated = 'message.event.contact.created',
  MessageContactUpdated = 'message.event.contact.updated',
  MessageContactDeleted = 'message.event.contact.deleted',
  MessageChatCreated = 'message.event.chat.created',
  MessageChatUpdated = 'message.event.chat.updated',
  MessageChatDeleted = 'message.event.chat.deleted',
  MessageMessageCreated = 'message.event.message.created',
  MessageMessageUpdated = 'message.event.message.updated',
  MessageMessageListDeleted = 'message.event.message.list.deleted',
  MessageMessageDeleted = 'message.event.message.deleted',
  MessageUserActivity = 'message.event.user.activity',
  MessageUserActivityForLiveChat = 'message.event.user.live-chat.activity',

  MessagePinMessage = 'message.event.live-chat.ws.message.pin',
  MessageUnpinMessage = 'message.event.live-chat.ws.message.unpin',

  MessageMessageModelDbOperation = 'message.event.message-model.db-operation',
  OnlineUserRefresh = 'connect-messenger.event.live-chat.client.online-state',
}
