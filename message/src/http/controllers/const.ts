import { MessagingTypeEnum } from '@pe/message-kit';

export const MESSAGING_TYPE_PLACEHOLDER: string = 'type';
export const APP_NAME_PLACEHOLDER: string = 'appName';
export const BUSINESS_ID_PLACEHOLDER: string = 'businessId';
export const BUSINESS_ID_NON_GUARDED_PLACEHOLDER: string = 'businessIdNonGuarded';
export const CHANNEL_ID_PLACEHOLDER: string = 'channelId';
export const CHAT_ID_PLACEHOLDER: string = 'chatId';
export const CHAT_INVITE_ID_PLACEHOLDER: string = 'chatInviteId';
export const CHAT_INVITE_CODE_PLACEHOLDER: string = 'chatInviteCode';
export const CHAT_TEMPLATE_ID_PLACEHOLDER: string = 'chatTemplateId';
export const CONVERSATION_ID_PLACEHOLDER: string = 'conversationId';
export const GROUP_ID_PLACEHOLDER: string = 'groupId';
export const CHAT_MESSAGE_ID_PLACEHOLDER: string = 'messageId';
export const CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER: string = 'draftId';
export const CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER: string = 'messageTemplateId';
export const CHAT_MEMBER_ID_PLACEHOLDER: string = 'memberId';
export const CONTACT_ID_PLACEHOLDER: string = 'contactId';
export const USER_ID_PLACEHOLDER: string = 'userId';
export const INTEGRATION_LINK_ID_PLACEHOLDER: string = 'integrationLinkId';

export const MESSAGING_TYPE_PLACEHOLDER_C: string = ':type';
export const APP_NAME_PLACEHOLDER_C: string = ':appName';
export const BUSINESS_ID_PLACEHOLDER_C: string = ':businessId';
export const BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C: string = ':businessIdNonGuarded';
export const CHANNEL_ID_PLACEHOLDER_C: string = ':channelId';
export const CHAT_ID_PLACEHOLDER_C: string = ':chatId';
export const CHAT_INVITE_ID_PLACEHOLDER_C: string = ':chatInviteId';
export const CHAT_INVITE_CODE_PLACEHOLDER_C: string = ':chatInviteCode';
export const CHAT_TEMPLATE_ID_PLACEHOLDER_C: string = ':chatTemplateId';
export const CONVERSATION_ID_PLACEHOLDER_C: string = ':conversationId';
export const GROUP_ID_PLACEHOLDER_C: string = ':groupId';
export const CHAT_MESSAGE_ID_PLACEHOLDER_C: string = ':messageId';
export const CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER_C: string = ':draftId';
export const CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C: string = ':messageTemplateId';
export const CHAT_MEMBER_ID_PLACEHOLDER_C: string = ':memberId';
export const CONTACT_ID_PLACEHOLDER_C: string = ':contactId';
export const USER_ID_PLACEHOLDER_C: string = ':userId';
export const INTEGRATION_LINK_ID_PLACEHOLDER_C: string = ':integrationLinkId';

export const ALL_CHANNEL_MESSAGING_TYPES: MessagingTypeEnum[] = [
  MessagingTypeEnum.AppChannel,
  MessagingTypeEnum.Channel,
  MessagingTypeEnum.Email,
];
