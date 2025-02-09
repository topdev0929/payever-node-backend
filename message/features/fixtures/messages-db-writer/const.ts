export const CHAT_ID: string = '_id-of-customer-chat-4';
export const TEXT_MESSAGE_ID = 'f60b9568-700c-4686-8c4b-badf5779c3c0';
export const TEXT_MESSAGE_ID_2 = 'f60b9568-700c-4686-8c4b-badf5779c3c2';
export const TEXT_MESSAGE_ID_3 = 'chat4-message1';
export const REPLY_TO_TEXT_MESSAGE_ID_1='reply-to-text-message-id-1';
export const REPLY_TO_TEXT_MESSAGE_ID_2='reply-to-text-message-id-2';
export const REPLY_TO_TEXT_MESSAGE_ID_3='reply-to-text-message-id-3';
export const EVENT_MESSAGE_ID = 'eb7e87a9-9fd6-40e6-9b05-b62be1afae9d';
export const EVENT_MESSAGE_ID_2 = 'e6da73f3-1e95-4c2d-87d6-a610ea5898a2';
export const EVENT_MESSAGE_ID_3 = 'e6da73f3-1e95-4c2d-87d6-a610ea5898a3';
export const TEMPLATE_MESSAGE_ID = 'c28fb15d-1c84-4076-8561-d74d43c395fd';
export const TEMPLATE_MESSAGE_ID_2 = 'c28fb15d-1c84-4076-8561-d74d43c395f2';
export const TEMPLATE_MESSAGE_ID_3 = 'c28fb15d-1c84-4076-8561-d74d43c395f3';
export const BOX_MESSAGE_ID = '4a168403-3f98-4c7f-9594-681fba0daadf';
export const BOX_MESSAGE_ID_2 = '4a168403-3f98-4c7f-9594-681fba0daad2';
export const BOX_MESSAGE_ID_3 = '4a168403-3f98-4c7f-9594-681fba0daad3';
export const CONTACT_ID = '4cf344aa-fe82-4efb-91f2-5df73dbc216d';
export const CONTACT_ID_2 = 'c3302234-29c0-4cd2-9338-518f161ec5e7';
export const ENCRYPTED_CONTENT = '9771d46437f0e3061c125b01baaea95f';
export const ENCRYPTED_CONTENT_TYPE = '-mocked-encrypted-content-type';
export const ENCRYPTED_CONTENT_PAYLOAD = '-mocked-encrypted-content-payload';
export const SALT = 'pba5LieAb/OmkRGpuEqrEM8u6LYFJeMChlU/vOffvY2jAM/nOv/gQVFicWdRHIo98eYHCOEsBSrU8JVlqYJkoOH+IOeiH/JyRogFtwBt/GZmY6S5BHAUMKXhC8Ow1kP2';
export const BUSINESS_ID = '_id-of-existing-business';
export const SENT_AT = '2021-04-05T11:08:08.626Z';
export const SENT_AT_2 = '2021-04-05T11:08:10.000Z';
export const ENCRYPTED_CONTENT_UPDATED = '1a5be2ac3063b024b86f644d6045ae2f';

export const TEXT_MESSAGE = {
  _id: TEXT_MESSAGE_ID,
  attachments: [
    {
      _id: '1ec78987-cc75-40ee-a58f-b266a9a1deac',
      mimeType: 'image/jpg',
      size: 100,
      title: 'title',
      url: '',
      data: {
        test: 'OK',
      },
    }
  ],
  chat: CHAT_ID,
  content: ENCRYPTED_CONTENT,
  contentType: ENCRYPTED_CONTENT_TYPE,
  contentPayload: ENCRYPTED_CONTENT_PAYLOAD,
  deletedForUsers: [],
  mentions: [
    '123456',
    '987654321'
  ],
  forwardFrom: {
    _id: 'fbe2cc4b-fa86-450a-971f-58da8f8930db',
    sender: 'sender',
    senderTitle: 'senderTitle',
  },
  replyTo: '70b5b7bc-ad87-4401-aee6-207bc6707e3a',
  replyToContent: ENCRYPTED_CONTENT,
  sender: CONTACT_ID_2,
  sentAt: SENT_AT,
  readBy:[
    'user-1',
  ],
  status: 'sent',
  type: 'text',
};

export const TEXT_MESSAGE_EDITED = {
  ...TEXT_MESSAGE,
  sentAt: SENT_AT_2,
};

export const TEXT_MESSAGE_2 = {
  ...TEXT_MESSAGE,
  _id: TEXT_MESSAGE_ID_2,
  content: 'text-message-content-2',
};

export const TEXT_MESSAGE_3 = {
  ...TEXT_MESSAGE,
  _id: TEXT_MESSAGE_ID_3,
  content: 'text-message-content-3',
};

export const REPLY_TO_TEXT_MESSAGE_1 = {
  _id: REPLY_TO_TEXT_MESSAGE_ID_1,
  chat: CHAT_ID,
  content: 'REPLY_TO_TEXT_MESSAGE_1',
  replyTo: TEXT_MESSAGE_ID,
  replyToContent: ENCRYPTED_CONTENT,
  sender: CONTACT_ID,
  sentAt: SENT_AT,
  status: 'sent',
  type: 'text',
};

export const REPLY_TO_TEXT_MESSAGE_2 = {
  ...REPLY_TO_TEXT_MESSAGE_1,
  _id: REPLY_TO_TEXT_MESSAGE_ID_2,
  content: 'REPLY_TO_TEXT_MESSAGE_2',
  replyTo: TEXT_MESSAGE_ID,
  replyToContent: ENCRYPTED_CONTENT,
};

export const REPLY_TO_TEXT_MESSAGE_3 = {
  ...REPLY_TO_TEXT_MESSAGE_1,
  _id: REPLY_TO_TEXT_MESSAGE_ID_3,
  content: 'text-message-content-2',
  replyTo: TEXT_MESSAGE_ID_2,
  replyToContent: 'REPLY_TO_TEXT_MESSAGE_3',
};

export const EVENT_MESSAGE = {
  _id: EVENT_MESSAGE_ID,
  eventName:'test-event',
  chat: CHAT_ID,
  sender: CONTACT_ID_2,
  sentAt: SENT_AT,
  status: 'sent',
  type: 'event',
};

export const EVENT_MESSAGE_2 = {
  ...EVENT_MESSAGE,
  _id: EVENT_MESSAGE_ID_2,
  ventName:'test-event-2',
};

export const EVENT_MESSAGE_3 = {
  ...EVENT_MESSAGE,
  _id: EVENT_MESSAGE_ID_3,
  ventName:'test-event-3',
};

export const TEMPLATE_MESSAGE = {
  _id: TEMPLATE_MESSAGE_ID,
  components: [
    {
      type: 'body',
      parameters: [
        {
          type: 'image',
          image: {
            link: 'https://cdn.x.com'
          }
        }
      ]
    }
  ],
  chat: CHAT_ID,
  sender: CONTACT_ID_2,
  sentAt: SENT_AT,
  status: 'sent',
  type: 'template',
};

export const TEMPLATE_MESSAGE_2 = {
  ...TEMPLATE_MESSAGE,
  _id: TEMPLATE_MESSAGE_ID_2,  
};

export const TEMPLATE_MESSAGE_3 = {
  ...TEMPLATE_MESSAGE,
  _id: TEMPLATE_MESSAGE_ID_3,  
};

export const BOX_MESSAGE = {
  _id: BOX_MESSAGE_ID,
  interactive:{
    action: 'test-action',
    defaultLanguage:'defaultLanguage',
    icon: 'checklist',
    image: 'test-image',
    translations:{
      'en':'Hi',      
    },
  },
  chat: CHAT_ID,
  sender: CONTACT_ID_2,
  sentAt: SENT_AT,
  status: 'sent',
  type: 'box',
};

export const BOX_MESSAGE_2 = {
  ...BOX_MESSAGE,
  _id: BOX_MESSAGE_ID_2,  
};

export const BOX_MESSAGE_3 = {
  ...BOX_MESSAGE,
  _id: BOX_MESSAGE_ID_3,  
};

export const TEXT_MESSAGE_JSON = JSON.stringify(TEXT_MESSAGE);
export const TEXT_MESSAGE_EDITED_JSON = JSON.stringify(TEXT_MESSAGE_EDITED);
export const TEXT_MESSAGE_JSON_2 = JSON.stringify(TEXT_MESSAGE_2);
export const TEXT_MESSAGE_JSON_3 = JSON.stringify(TEXT_MESSAGE_3);

export const EVENT_MESSAGE_JSON = JSON.stringify(EVENT_MESSAGE);
export const EVENT_MESSAGE_JSON_2 = JSON.stringify(EVENT_MESSAGE_2);
export const EVENT_MESSAGE_JSON_3 = JSON.stringify(EVENT_MESSAGE_3);

export const TEMPLATE_MESSAGE_JSON = JSON.stringify(TEMPLATE_MESSAGE);
export const TEMPLATE_MESSAGE_JSON_2 = JSON.stringify(TEMPLATE_MESSAGE_2);
export const TEMPLATE_MESSAGE_JSON_3 = JSON.stringify(TEMPLATE_MESSAGE_3);

export const BOX_MESSAGE_JSON = JSON.stringify(BOX_MESSAGE);
export const BOX_MESSAGE_JSON_2 = JSON.stringify(BOX_MESSAGE_2);
export const BOX_MESSAGE_JSON_3 = JSON.stringify(BOX_MESSAGE_3);