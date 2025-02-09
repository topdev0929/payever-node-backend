export enum WsIncomingMessageEventCodeEnum {
  WsClientSendMessage = 'messages.ws-client.message.send',
  WsClientUpdateMessage = 'messages.ws-client.message.update',
  WsClientDeleteMessage = 'messages.ws-client.message.delete',
  WsClientDeleteListMessage = 'messages.ws-client.list.message.delete',
  WsClientMarkMessageRead = 'messages.ws-client.message.mark-read',
  WsClientMarkListMessageRead = 'messages.ws-client.message.list-mark-read',
  WsClientMarkMessageUnread = 'messages.ws-client.message.mark-unread',
  WsClientForwardMessage = 'messages.ws-client.message.forward',
  WsClientPinMessage = 'messages.ws-client.message.pin',
  WsClientUnpinMessage = 'messages.ws-client.message.unpin',

  WsClientJoinBusinessRoom = 'messages.ws-client.business-room.join',
  WsClientLeaveBusinessRoom = 'messages.ws-client.business-room.leave',

  WsClientJoinChatRoom = 'messages.ws-client.chat-room.join',
  WsClientLeaveChatRoom = 'messages.ws-client.chat-room.leave',

  WsClientExcludeMemberFromChat = 'messages.ws-client.chat.exclude-member',
  WsClientLeaveMemberFromChat = 'messages.ws-client.chat.leave-member',

  WsClientChatTyping = 'messages.ws-client.chat-room.typing',
  WsClientChatTypingStopped = 'messages.ws-client.chat-room.typing-stopped',

  WsClientUpdateMember = 'messages.ws-client.member.update',

  WsClientScrollRequest = 'messages.ws-client.message.scroll.request',
  
  WsClientChatSummaryRequest = 'messages.ws-client.chat-summary.request',
  WsClientChatUnreadMessagesCountRequest = 'messages.ws-client.unread-messages-count.request',
}

export enum WsOutgoingMessageEventCodeEnum {
  WsClientChatCreated = 'messages.ws-client.chat.created',
  WsClientChatUpdated = 'messages.ws-client.chat.updated',
  WsClientChatDeleted = 'messages.ws-client.chat.deleted',

  WsClientChatOnlineMembersUpdated = 'messages.ws-client.chat.online-members-updated',
  WsClientChatTypingMembersUpdated = 'messages.ws-client.chat.typing-members-updated',

  WsClientMessagePosted = 'messages.ws-client.message.posted',
  WsClientMessageDeleted = 'messages.ws-client.message.deleted',
  WsClientMessageUpdated = 'messages.ws-client.message.updated',
  WsClientListMessageUpdated = 'messages.ws-client.list.message.updated',
  WsClientMessageWithdrawed = 'messages.ws-client.message.withdraw',

  WsClientMessagePinned = 'messages.ws-client.message.pinned',
  WsClientMessageUnpinned = 'messages.ws-client.message.unpinned',

  WsClientMemberJoinedRoom = 'messages.ws-client.room.joined',
  WsClientMemberLeftRoom = 'messages.ws-client.room.left',

  WsClientScrollResponse = 'messages.ws-client.scroll.response',

  WsClientMemberIncludedToChat = 'messages.ws-client.chat.member.included',
  WsClientMemberChanged = 'messages.ws-client.chat.member.changed',
  WsClientMemberExcludedFromChat = 'messages.ws-client.chat.member.excluded',

  WsClientContactCreated = 'messages.ws-client.contact.created',
  WsClientContactUpdated = 'messages.ws-client.contact.updated',
  WsClientContactStatus = 'messages.ws-client.contact.status',

  WsClientUserStatus = 'messages.ws-client.user.status',

  WsClientInitialAppChannelsCreated = 'messages.ws-client.events.initial-app-channels-created',

  WsClientChatSummaryResponse = 'messages.ws-client.chat-summary.response',
  WsClientChatUnreadMessagesCountResponse = 'messages.ws-client.unread-messages-count.response',

  WsClientOnlineUsers = 'messages.ws-client.online.users',
}
