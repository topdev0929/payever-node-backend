import {
  ChatMessageInteractiveIconEnum,
  MessagingTypeEnum,
  ChatMemberRoleEnum,
} from '@pe/message-kit';

import { ChatAppEnum, AddMemberMethodEnum } from '../src/message/enums';
import { ChatMessageTemplate, ChatTemplate } from '../src/message/submodules/templates';

export type ChatTemplatePrototype = ChatTemplate & { messages: ChatMessageTemplate[]; };

const COMMERCEOS_URL: string = '${MICRO_HOST_FRONTEND_COMMERCEOS}';

const CHAT_TEMPLATE_ID_1: string = 'f9fd2225-eb67-4981-8674-c4f46bc18fcc'; // shop
const CHAT_TEMPLATE_ID_2: string = 'a0404a38-20aa-42e4-b567-d3aef0dd5f60'; // site
const CHAT_TEMPLATE_ID_3: string = '20b1800a-2340-4534-8b66-93574b0f679f'; // message
const CHAT_TEMPLATE_ID_4: string = '3aa1a29f-1415-4fe4-a747-27981c6af7eb'; // commecreos
const CHAT_TEMPLATE_ID_5: string = 'a31e83a0-9a8b-4ab1-ad21-16dfc70e538b'; // products
const CHAT_TEMPLATE_ID_6: string = '3a1f51b8-e0ad-4fb0-b563-1b740c7a151c'; // pos
const CHAT_TEMPLATE_ID_7: string = '02edd868-9751-4e8b-9f44-09b98bad309a'; // checkout
const CHAT_TEMPLATE_ID_8: string = '35a78440-2544-43e3-8220-928a63cb071a'; // mail
const CHAT_TEMPLATE_ID_9: string = '22ce06b9-3bdf-497f-ae9e-b47a45418418'; // ads
const CHAT_TEMPLATE_ID_10: string = '270593cb-3ddf-428d-9513-bdf2f83bc332'; // shipping
const CHAT_TEMPLATE_ID_11: string = '0e3d402c-b285-4d4a-b81b-1b1f819dbe24'; // transactions
const CHAT_TEMPLATE_ID_12: string = '74deb982-3fbf-40ef-b470-44877b7b8dd6'; // connect
const CHAT_TEMPLATE_ID_13: string = 'abd4ee24-7c2a-48d5-8c59-525c2ee1eeb8'; // contacts
const CHAT_TEMPLATE_ID_14: string = '9642cb1a-f848-4b29-984b-47626e92c20d'; // studio
const CHAT_TEMPLATE_ID_15: string = '85400e7d-5864-4c05-8124-e195afc43941'; // invoice
const CHAT_TEMPLATE_ID_16: string = '95400e7d-5864-4c05-8124-e195afc43942'; // Appointments
const CHAT_TEMPLATE_ID_17: string = '25400e7d-5864-4c05-8124-e195afc43943'; // Affiliates
const CHAT_TEMPLATE_ID_18: string = '15400e7d-5864-4c05-8124-e195afc43944'; // Blog
const CHAT_TEMPLATE_ID_19: string = '65400e7d-5864-4c05-8124-e195afc43945'; // Coupons
const CHAT_TEMPLATE_ID_20: string = '45400e7d-5864-4c05-8124-e195afc43946'; // Social
const CHAT_TEMPLATE_ID_21: string = 'a5400e7d-5864-4c05-8124-e195afc43947'; // Subscriptions
const CHAT_TEMPLATE_ID_22: string = 'f5400e7d-5864-4c05-8124-e195afc43948'; // Statistics
const CHAT_TEMPLATE_ID_23: string = '15400e7d-5864-4c05-8124-e195afc43949'; // Settings


export const BUSINESS_SUPPORT_CHANNEL: string = '34a6e553-838c-4753-8539-46600ea2bc0a';

export const templatesFixture: ChatTemplatePrototype[] = [{
  _id: CHAT_TEMPLATE_ID_1,
  app: ChatAppEnum.Shop,
  description: '',
  messages: [
    {
      _id: '41ef11af-12c0-4dad-97c5-037be794f3a0',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360023894674-How-to-setup-a-shop',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick Tour',
        },
      },
      type: 'box',
    },
    {
      _id: '49faf157-dd4d-4636-b68c-ec25bde94656',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/themes',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Review Theme',
        },
      },
      type: 'box',
    },
    {
      _id: 'c0653691-5d2a-4e84-af19-1c8c22f761cf',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/settings',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add a Logo',
        },
      },
      type: 'box',
    },
    {
      _id: 'c5927617-b384-4991-9ff7-05be995bff7d',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/products/list?addExisting=true',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Products',
        },
      },
      type: 'box',
    },
    {
      _id: '92ee7700-be16-4769-a377-d5b4c23f156e',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/settings',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Choose Domain',
        },
      },
      type: 'box',
    },
    {
      _id: 'feddc59f-654c-4b78-980c-e8df48c71113',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/edit',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Customize Theme',
        },
      },
      type: 'box',
    },
    {
      _id: '6d736c1b-b84e-431d-b9cb-13180f79d725',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/settings/policies',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Legal Terms',
        },
      },
      type: 'box',
    },
    {
      _id: '2c08f737-8e06-4000-9d95-da12c2f761cc',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/checkout/{{CHECKOUT_ID}}/panel-payments',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Payment Options',
        },
      },
      type: 'box',
    },
    {
      _id: 'f996e5ce-44d2-4f0d-b638-49c3881074f5',
      chatTemplate: CHAT_TEMPLATE_ID_1,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/settings',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Launch live',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Shop Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_2,
  app: ChatAppEnum.Site,
  description: '',
  messages: [
    {
      _id: '0a77d0de-91c2-4fb0-8218-1e384eecc6cf',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/site/{{SITE_ID}}/themes',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Review Theme',
        },
      },
      type: 'box',
    },
    {
      _id: '6ef6f73a-ca18-4890-b105-9b0a08793ca7',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/settings/info',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add a Logo',
        },
      },
      type: 'box',
    },
    {
      _id: '3a45471a-d939-431b-b934-627b3b3c4947',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/products/list?addExisting=true',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Products',
        },
      },
      type: 'box',
    },
    {
      _id: 'c99b4079-d0ce-4e7f-8907-4baa5cfdfd37',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/site/{{SITE_ID}}/settings',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Choose Domain',
        },
      },
      type: 'box',
    },
    {
      _id: 'e4583669-c126-4c91-bc13-c1616d23e8d1',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/site/{{SITE_ID}}/edit',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Customize Theme',
        },
      },
      type: 'box',
    },
    {
      _id: 'd1b7010f-8721-4f65-a866-55c930333521',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/settings/policies',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Legal Terms',
        },
      },
      type: 'box',
    },
    {
      _id: 'a2c5ed10-e1b4-4631-9f8e-12122a13538d',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/checkout/{{CHECKOUT_ID}}/panel-payments',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Payment Options',
        },
      },
      type: 'box',
    },
    {
      _id: 'f59adbff-726d-4b09-a6c9-5bc4b3990aad',
      chatTemplate: CHAT_TEMPLATE_ID_2,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/settings/general/password',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Launch live',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Site Checklist',
  type: MessagingTypeEnum.AppChannel,

}, {
  _id: CHAT_TEMPLATE_ID_3,
  app: ChatAppEnum.Message,
  description: '',
  messages: [
    {
      _id: '8886f9b3-b617-40ac-b588-ad0819914cda',
      chatTemplate: CHAT_TEMPLATE_ID_3,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/settings/info',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add a Logo',
        },
      },
      type: 'box',
    },
    {
      _id: '2e697e1f-5cc2-41ed-bb46-cd20b076e5e9',
      chatTemplate: CHAT_TEMPLATE_ID_3,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/checkout/{{CHECKOUT_ID}}/panel-payments',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add Payment Options',
        },
      },
      type: 'box',
    },
    {
      _id: 'b72ff360-7cb3-4359-9cd6-0f9d36913276',
      chatTemplate: CHAT_TEMPLATE_ID_3,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/message/connect',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Connect Apps',
        },
      },
      type: 'box',
    },
    {
      _id: '69e6a046-1eb6-4808-ba83-45292ad3abbd',
      chatTemplate: CHAT_TEMPLATE_ID_3,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/message/integration',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Setup Communication',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Message Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_4,
  app: ChatAppEnum.CommerceOS,
  description: '',
  messages: [
    {
      _id: 'b70f54ec-3100-47e9-a2bf-800a21ed9c6a',
      chatTemplate: CHAT_TEMPLATE_ID_4,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/info/edit;view=widgets',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add and Edit your business applications',
        },
      },
      type: 'box',
    },
    {
      _id: '0e8ff236-0f2d-4bcb-8453-251bdb1c59e6',
      chatTemplate: CHAT_TEMPLATE_ID_4,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/info/overview',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Customise your Dashboard',
        },
      },
      type: 'box',
    },
    {
      _id: 'b1a14dff-19fd-47ba-b7eb-8b48fe702d4f',
      chatTemplate: CHAT_TEMPLATE_ID_4,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/settings/employee',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Invite co-worker',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever CommerceOS Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_5,
  app: ChatAppEnum.Products,
  description: '',
  messages: [
    {
      _id: 'e1f3384e-fcf9-4155-b8f1-fb2d166a755e',
      chatTemplate: CHAT_TEMPLATE_ID_5,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/categories/360001870634-payever-Products',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Products',
        },
      },
      type: 'box',
    },
    {
      _id: '10c7602d-6c19-49b8-a63a-da094bcca2c0',
      chatTemplate: CHAT_TEMPLATE_ID_5,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/products/list?addExisting=true',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add a first product',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Products Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_6,
  app: ChatAppEnum.Pos,
  description: '',
  messages: [
    {
      _id: 'dbaa8ece-8361-4dfd-85aa-6e89b4c2fda7',
      chatTemplate: CHAT_TEMPLATE_ID_6,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360023894694-How-to-setup-a-POS-terminal',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Point of Sale',
        },
      },
      type: 'box',
    },
    {
      _id: '7e7254d1-24ff-41a5-8109-b6eb93d5cf78',
      chatTemplate: CHAT_TEMPLATE_ID_6,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/pos/setup/create',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add a logo to your payever Point of Sale',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Point Of Sale Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_7,
  app: ChatAppEnum.Checkout,
  description: '',
  messages: [
    {
      _id: 'a5b28883-42e1-4138-973f-6ee3c67863f1',
      chatTemplate: CHAT_TEMPLATE_ID_7,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360023893874-How-to-setup-a-checkout',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Checkout',
        },
      },
      type: 'box',
    },
    {
      _id: 'e70bba9f-5aa5-4bec-bcb1-741445e51dd6',
      chatTemplate: CHAT_TEMPLATE_ID_7,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/checkout/{{CHECKOUT_ID}}/panel-settings',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add a logo to your payever Checkout',
        },
      },
      type: 'box',
    },
    {
      _id: '48d4b4c8-45ac-434e-87e2-60e282feb8e1',
      chatTemplate: CHAT_TEMPLATE_ID_7,
      interactive: {
        action: COMMERCEOS_URL + '/business/{{BUSINESS_ID}}/checkout/{{CHECKOUT_ID}}/panel-payments',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Add payment options to your payever Checkout',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Checkout Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_8,
  app: ChatAppEnum.Mail,
  description: '',
  messages: [
    {
      _id: 'bc723b0d-d778-4bc6-94dc-1dc94429638f',
      chatTemplate: CHAT_TEMPLATE_ID_8,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360023894714-How-to-setup-an-offer-via-mail',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Mail',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Mail Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_9,
  app: ChatAppEnum.Ads,
  description: '',
  messages: [
    {
      _id: '4d78b84b-d42d-4cef-b3bb-007ceb1861c6',
      chatTemplate: CHAT_TEMPLATE_ID_9,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Ads',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Ads',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Ads Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_10,
  app: ChatAppEnum.Shipping,
  description: '',
  messages: [
    {
      _id: 'e202669f-46f4-4bb4-adb8-61453701c97c',
      chatTemplate: CHAT_TEMPLATE_ID_10,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013519499-How-to-set-up-payever-Shipping',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Shipping',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Shipping Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_11,
  app: ChatAppEnum.Transactions,
  description: '',
  messages: [
    {
      _id: '56770340-d822-4ddb-a843-3b9574b8ea10',
      chatTemplate: CHAT_TEMPLATE_ID_11,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013450280-How-to-set-up-payever-Transactions',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Transactions',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Transactions Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_12,
  app: ChatAppEnum.Connect,
  description: '',
  messages: [
    {
      _id: '0bc739b5-e41e-4e43-b6e4-b9ef917bdc52',
      chatTemplate: CHAT_TEMPLATE_ID_12,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Connect',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Connect',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Connect Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_13,
  app: ChatAppEnum.Contacts,
  description: '',
  messages: [
    {
      _id: '952bc5a8-5fa1-464a-bccc-106c08ed3b07',
      chatTemplate: CHAT_TEMPLATE_ID_13,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013519259-How-to-add-contacts',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Contacts',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Contacts Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_14,
  app: ChatAppEnum.Studio,
  description: '',
  messages: [
    {
      _id: '241c53b3-6662-4c98-af8c-db82a575a0e1',
      chatTemplate: CHAT_TEMPLATE_ID_14,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360023894814-How-to-get-started-with-payever-Studio',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Studio',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Studio Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_15,
  app: ChatAppEnum.Invoice,
  description: '',
  messages: [
    {
      _id: '0bc739b5-e41e-4e43-b6e4-b9ef917bdc51',
      chatTemplate: CHAT_TEMPLATE_ID_15,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Invoice',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Invoice',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Invoice Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_16,
  app: ChatAppEnum.Appointments,
  description: '',
  messages: [
    {
      _id: '21819827-5946-4016-8fae-ebb8690da8ba',
      chatTemplate: CHAT_TEMPLATE_ID_16,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Appointments',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Appointments',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Appointments Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_17,
  app: ChatAppEnum.Affiliates,
  description: '',
  messages: [
    {
      _id: 'a985090d-e028-4534-9d32-444fed84a9b21',
      chatTemplate: CHAT_TEMPLATE_ID_17,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Affiliates',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Affiliates',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Affiliates Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_18,
  app: ChatAppEnum.Blog,
  description: '',
  messages: [
    {
      _id: '4fda829c-ce9f-4712-9819-c8f213cadb56',
      chatTemplate: CHAT_TEMPLATE_ID_18,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Blog',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Blog',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Blog Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_19,
  app: ChatAppEnum.Coupons,
  description: '',
  messages: [
    {
      _id: '9183da5a-a84b-4ccc-9a18-945fab33531c',
      chatTemplate: CHAT_TEMPLATE_ID_19,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Coupons',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Coupons',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Coupons Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_20,
  app: ChatAppEnum.Social,
  description: '',
  messages: [
    {
      _id: 'c57d73c9-432d-4a06-9546-265f27bc1300',
      chatTemplate: CHAT_TEMPLATE_ID_20,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Social',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Social',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Social Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_21,
  app: ChatAppEnum.Subscriptions,
  description: '',
  messages: [
    {
      _id: 'b2bac5be-f252-4d4f-921f-78fe762c2c20',
      chatTemplate: CHAT_TEMPLATE_ID_21,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Subscriptions',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Subscriptions',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Subscriptions Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_22,
  app: ChatAppEnum.Statistics,
  description: '',
  messages: [
    {
      _id: '1154ea86-a6a9-48ff-8c87-f7c839b2c095',
      chatTemplate: CHAT_TEMPLATE_ID_22,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Statistics',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Statistics',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Statistics Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: CHAT_TEMPLATE_ID_23,
  app: ChatAppEnum.Settings,
  description: '',
  messages: [
    {
      _id: '76d18ca9-02c8-4436-a8b3-7a03fd1fdf86',
      chatTemplate: CHAT_TEMPLATE_ID_23,
      interactive: {
        action: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Settings',
        defaultLanguage: 'en',
        icon: ChatMessageInteractiveIconEnum.Checklist,
        translations: {
          en: 'Get a quick tour around payever Settings',
        },
      },
      type: 'box',
    },
  ],
  title: 'payever Settings Checklist',
  type: MessagingTypeEnum.AppChannel,
}, {
  _id: BUSINESS_SUPPORT_CHANNEL,
  description: '',
  messages: [{
    _id: '05ec0cae-66c0-4f6e-95cc-6f1003ac92d5',
    chatTemplate: BUSINESS_SUPPORT_CHANNEL,
    interactive: {
      defaultLanguage: 'en',
      image: 'https://payevertesting.blob.core.windows.net/message/0df591ff-21b2-4c1f-9f23-9e62c42d84a4-commerceos-message.png',
      translations: {
        en: 'Welcome to payever Message app. We are here to help you. Let\'s get started by clicking the button below!',
      },
    },
    order: 10,
    type: 'box',
  }, {
    _id: 'd6cd1447-cfb3-449c-9c21-b747c1052e1f',
    chatTemplate: BUSINESS_SUPPORT_CHANNEL,
    interactive: {
      action: 'message.action.channel.create',
      defaultLanguage: 'en',
      translations: {
        en: 'Add channel',
      },
    },
    order: 40,
    type: 'box',
  }, {
    _id: 'f2a4439b-b33a-4dfb-b04c-ed27091334f8',
    chatTemplate: BUSINESS_SUPPORT_CHANNEL,
    interactive: {
      action: 'message.action.channel.permissions',
      defaultLanguage: 'en',
      translations: {
        en: 'Permissions',
      },
    },
    order: 50,
    type: 'box',
  }],

  members: [{
    addMethod: AddMemberMethodEnum.OWNER,
    addedBy: '{{{ business.owner || business.userAccountId }}}',
    role: ChatMemberRoleEnum.Admin,
    user: '{{{ business.owner || business.userAccountId }}}',
  }],
  subType: 'support',
  title: '{{{ business.name }}} / Support Channel',
  type: MessagingTypeEnum.Group,
}];
