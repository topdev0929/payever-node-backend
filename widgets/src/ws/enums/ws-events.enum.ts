export enum WsIncomingEventCodeEnum {
  // WsClientSendMessage = 'messages.ws-client.message.send',
  // WsClientUpdateMessage = 'messages.ws-client.message.update',
  // WsClientDeleteMessage = 'messages.ws-client.message.delete',
  // WsClientMarkMessageRead = 'messages.ws-client.message.mark-read',
  // WsClientForwardMessage = 'messages.ws-client.message.forward',
  // WsClientPinMessage = 'messages.ws-client.message.pin',
  // WsClientUnpinMessage = 'messages.ws-client.message.unpin',

  WsClientJoinBusinessRoom = 'messages.ws-client.business-room.join',
  WsClientLeaveBusinessRoom = 'messages.ws-client.business-room.leave',

  WsClientJoinChatRoom = 'messages.ws-client.chat-room.join',
  WsClientLeaveChatRoom = 'messages.ws-client.chat-room.leave',
  WsClientChatTyping = 'messages.ws-client.chat-room.typing',

  WsClientUpdateMember = 'messages.ws-client.member.update',

  WsClientUserSeen = 'messages.ws-client.user.seen',
}

export enum WsOutgoingEventCodeEnum {
  WsClientChatCreated = 'messages.ws-client.chat.created',
  WsClientChatUpdated = 'messages.ws-client.chat.updated',
  WsClientChatDeleted = 'messages.ws-client.chat.deleted',

  WsClientChatTyping = 'messages.ws-client.chat.typing',

  WsClientMessagePosted = 'messages.ws-client.message.posted',
  WsClientMessageDeleted = 'messages.ws-client.message.deleted',
  WsClientMessageUpdated = 'messages.ws-client.message.updated',
  WsClientMessageWithdrawed = 'messages.ws-client.message.withdraw',

  WsClientMemberJoinedRoom = 'messages.ws-client.room.joined',
  WsClientMemberLeftRoom = 'messages.ws-client.room.left',

  WsClientContactCreated = 'messages.ws-client.contact.created',
  WsClientContactUpdated = 'messages.ws-client.contact.updated',
  WsClientContactStatus = 'messages.ws-client.contact.status',

  WsClientUserStatus = 'messages.ws-client.user.status',

  WsClientInitialAppChannelsCreated = 'messages.ws-client.events.initial-app-channels-created',
}
