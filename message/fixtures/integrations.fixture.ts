import {
  MessagingIntegrationsEnum,
} from '@pe/message-kit';

import { Integration } from '../src/projections/schema';

export const integrationsFixture: Integration[] = [{
  _id: 'f9fd2225-eb67-4981-8674-c4f46bc18fcc',
  autoEnable: true,
  category: 'messaging',
  displayOptions: {
    _id: '41ef11af-12c0-4dad-97c5-037be794f3a0',
    icon: '#icon-message-whatsapp',
    title: 'message.whatsapp.title',
  },
  name: MessagingIntegrationsEnum.WhatsApp,
}, {
  _id: 'a0404a38-20aa-42e4-b567-d3aef0dd5f60',
  autoEnable: true,
  category: 'messaging',
  displayOptions: {
    _id: '66a7a983-bbb6-423b-98c1-25a18c6e0484',
    icon: '#icon-message-facebook-messenger',
    title: 'message.facebook-messenger.title',
  },
  name: MessagingIntegrationsEnum.FacebookMessenger,
}, {
  _id: '20b1800a-2340-4534-8b66-93574b0f679f',
  autoEnable: true,
  category: 'messaging',
  displayOptions: {
    _id: '2b27eab6-8fbb-49a4-89e1-3eebce1160c2',
    icon: '#icon-message-live-chat',
    title: 'message.live-chat.title',
  },
  name: MessagingIntegrationsEnum.LiveChat,
}, {
  _id: 'aebfed9d-9d44-4b73-bb90-ea14db329084',
  autoEnable: true,
  category: 'messaging',
  displayOptions: {
    _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
    icon: '#icon-message-instagram-messenger',
    title: 'message.instagram-messenger.title',
  },
  name: MessagingIntegrationsEnum.InstagramMessenger,
}, {
  _id: '3302e370-4df9-43a2-b3ea-6d7463dc290c',
  autoEnable: true,
  category: 'messaging',
  displayOptions: {
    _id: '3c27b6f1-8aa6-4f6f-af28-39a2be54fc6d',
    icon: '#icon-message-telegram',
    title: 'message.telegram.title',
  },
  name: MessagingIntegrationsEnum.Telegram,
}, {
  _id: '2f774967-94f5-4c28-8465-d8c23aea3e86',
  autoEnable: true,
  category: 'communications',
  displayOptions: {
    _id: '3f56db0f-b952-4ea0-9d30-12618a7c28e2',
    icon: '#icon-message-email',
    title: 'message.email.title',
  },
  name: MessagingIntegrationsEnum.Email,
}];
