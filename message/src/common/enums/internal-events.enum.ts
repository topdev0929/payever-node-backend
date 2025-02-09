export enum InternalEventCodesEnum {
  ChatCreated = 'chat.created',
  ChatDeleted = 'chat.deleted',
  ChatHardDeleted = 'chat.hard-deleted',
  ChatUpdated = 'chat.updated',
  ChatTyping = 'chat.typing',
  ChatOnlineMembersUpdated = 'chat.online-members.updated',

  MessagesCreated = 'chat.messages.created',
  MessageDeleted = 'chat.message.deleted',
  MessageListDeleted = 'chat.message.list.deleted',
  MessageUpdated = 'chat.message.updated',
  MessageListUpdated = 'chat.message.list.updated',

  MessagePinned = 'chat.message.pinned',
  MessageUnpinned = 'chat.message.unpinned',

  MemberIncluded = 'chat.member.included',
  MemberChanged = 'chat.member.changed',
  MemberExcluded = 'chat.member.excluded',
  MemberLeft = 'chat.member.left',

  ContactCreated = 'contact.created',
  ContactUpdated = 'contact.updated',
  ContactDeleted = 'contact.deleted',
  ContactStatus = 'contact.status',

  ChatTemplateCreated = 'chat.template.created',
  ChatTemplateDeleted = 'chat.template.deleted',
  ChatTemplateUpdated = 'chat.template.updated',

  MessageTemplateCreated = 'chat.message.template.created',
  MessageTemplateDeleted = 'chat.message.template.deleted',
  MessageTemplateUpdated = 'chat.message.template.updated',

  MessageAppInstalled = 'message-app.installed',

  UserStatusChanged = 'user.status.changed',
}
