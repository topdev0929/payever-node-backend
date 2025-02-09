import { FolderInterface, ScopeEnum } from '@pe/folders-plugin';
import { RuleInterface, RulesConditionEnum, RuleActionEnum } from '@pe/rules-sdk';
import { MessagingTypeEnum, MessagingIntegrationsEnum } from '@pe/message-kit';

const CHATS_FOLDER_ID: string = '9d9d7696-720d-4938-9281-96c01bdb9905';
const CHANNEL_FOLDER_ID: string = '8e79ce43-4a84-4fb7-b008-02f626b6d14b';
const EMAIL_FOLDER_ID: string = '8073cd97-36e6-41be-8145-98030f6934b9';

export const HeadlineFolders: FolderInterface[] = [
  {
    _id: CHATS_FOLDER_ID,
    isHeadline: true,
    isProtected: true,
    name: 'Chats',
    position: 1,
    scope: ScopeEnum.Default,

    parentFolderId: '/',
  },
  {
    _id: CHANNEL_FOLDER_ID,
    isHeadline: true,
    isProtected: true,
    name: 'Channel',
    position: 2,
    scope: ScopeEnum.Default,

    parentFolderId: '/',
  },
  {
    _id: EMAIL_FOLDER_ID,
    isHeadline: true,
    isProtected: true,
    name: 'Email',
    position: 3,
    scope: ScopeEnum.Default,

    parentFolderId: '/',
  },
];

export const HeadlinesRules: Array<RuleInterface & { _id: string }> = [
  {
    _id: 'f9feba29-3782-4536-939f-a79aacab3b6c',
    action: RuleActionEnum.move,
    condition: RulesConditionEnum.equals,
    description: 'Move email channels to "Channels" folder"',
    field: 'integrationName',
    folderId: EMAIL_FOLDER_ID,
    name: 'Emails to email folder',
    values: [MessagingIntegrationsEnum.Email],
  },
  {
    _id: 'bdfc2f49-7934-4b1d-be64-5474df34716f',
    action: RuleActionEnum.move,
    condition: RulesConditionEnum.equals,
    description: 'Move all direct chats to "Chats" folder',
    field: 'type',
    folderId: CHATS_FOLDER_ID,
    name: 'Direct chats to chats folder',
    values: [MessagingTypeEnum.DirectChat],
  },
  {
    _id: 'cfb2b856-d4e5-4bb4-9d50-fb0292be72f3',
    action: RuleActionEnum.move,
    condition: RulesConditionEnum.equals,
    description: 'Move all channels to "Channels" folder"',
    field: 'type',
    folderId: CHANNEL_FOLDER_ID,
    name: 'Channels to channel folder',
    values: [MessagingTypeEnum.Channel],
  },
];
