import { ContentInterface } from '../src/contents/interfaces';

// https://docs.google.com/spreadsheets/d/1DD7Aq4gg0NTlBFM2YVaLrpyycclUl07Iex2MjyeRVRU/edit#gid=0
export const contentsFixture: ContentInterface[] = [
  // CommerceOS - Welcome Notifications
  {
    _id: '5bbb9094-fd4a-4eea-9da7-23b91c0bbaab',
    icon: '#icon-bot-other',
    name: 'CommerceOS',
    url: '',
    children: [
      {
        _id: '073d88b9-0877-43d4-8a38-9a89998814fd',
        icon: '#icon-bot-other',
        name: 'CommerceOS/Applications',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/info/edit;view=widgets',
      },
      {
        _id: '1ef9523a-fe0b-45d6-bdf3-600e06d1a76f',
        icon: '#icon-bot-other',
        name: 'CommerceOS/Customise',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/info/overview',
      },
      {
        _id: 'cf25998d-e4ae-49bb-84c9-079cb4b3913b',
        icon: '#icon-bot-other',
        name: 'CommerceOS/Invite',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/settings/employee',
      },
    ],
  },

  // PAYEVER SHOP
  {
    _id: '1787846f-371d-422d-970e-331179923e58',
    icon: '#icon-bot-other',
    name: 'Shop',
    url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/shop',
    children: [
      {
        _id: 'f929c456-870b-4b90-acc7-edd78475f44f',
        icon: '#icon-bot-other',
        name: 'Themes',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/themes',
      },
      {
        _id: '3e4dd5bc-5ae1-4d0e-9aa1-a7a273f32b57',
        icon: '#icon-bot-other',
        name: 'Settings/Info',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/settings/info',
      },
      {
        _id: 'a2df77e1-5ad1-402d-928f-9ccacc1b7f18',
        icon: '#icon-bot-other',
        name: 'Products/Add',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/products/list?addExisting=true',
      },
      {
        _id: '25b5f4c7-4b4f-4f6c-8bb9-127683e5a3e8',
        icon: '#icon-bot-other',
        name: 'Settings/URL',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/settings',
      },
      {
        _id: '3b175a06-6f6a-4372-a67c-51062637b1a9',
        icon: '#icon-bot-other',
        name: 'Customise',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/shop/{{SHOP_ID}}/edit',
      },
      {
        _id: '6ac7cb52-53e5-4fa7-ac34-208c019cec4d',
        icon: '#icon-bot-other',
        name: 'Policies',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/settings/policies',
      },
      // {
      //   _id: '0bd5906d-2904-40c6-99a3-b31a43011a67',
      //   icon: '#icon-bot-other',
      //   name: '',
      //   url: '',
      // },
      {
        _id: '7adadf8f-fc24-4e2d-8a93-876647ca4b2f',
        icon: '#icon-bot-other',
        name: 'Password',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/settings/general/password',
      },
      {
        _id: 'd1b3876f-63dc-4c9a-853a-59f17daf6d57',
        icon: '#icon-bot-other',
        name: 'Payments',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/checkout/9ead4e72-e7b3-5fed-901d-c734cde50972/panel-payments',
      },
      // {
      //   _id: 'a34b6189-1a17-44c6-9ece-5283a1565603',
      //   icon: '#icon-bot-box',
      //   name: '',
      //   url: '',
      // },
    ],
  },


  // PAYEVER PRODUCTS
  {
    _id: '989befb0-6204-4b66-83ae-e23b8ff15a2b',
    icon: '#icon-bot-other',
    name: 'Product',
    url: '',
    children: [
      {
        _id: '1183075e-2b62-4a88-92ee-d15af5f49634',
        icon: '#icon-bot-other',
        name: 'Product/Add',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/products/list?addExisting=true',
      },
    ],
  },

  // PAYEVER POINT OF SALE
  {
    _id: 'f8c3ee78-4c6e-4ff0-82a4-727ecf51158f',
    icon: '#icon-bot-other',
    name: 'POS',
    url: '',
    children: [
      {
        _id: '75cbdb47-4f90-4a57-a848-b030d9aa5e56',
        icon: '#icon-bot-other',
        name: 'POS/Setup',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/pos/setup/create',
      },
    ],
  },

  // PAYEVER CHECKOUT
  {
    _id: '3efb187b-c37c-47f5-b26b-c2b7bd8e5992',
    icon: '#icon-bot-other',
    name: 'Checkout',
    url: '',
    children: [
      {
        _id: '0b07e8ba-901a-42c9-a549-88b3dfe6ccc7',
        icon: '#icon-bot-other',
        name: 'Checkout/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360023893874-How-to-setup-a-checkout',
      },
      // {
      //   _id: 'd16193e4-b5d1-4933-8b79-48e4e294a5b7',
      //   icon: '#icon-bot-other',
      //   name: '',
      //   url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/checkout/9ead4e72-e7b3-5fed-901d-c734cde50972/panel-settings',
      // },
      {
        _id: '8a3ba796-760a-4e70-ad12-6128db1793bf',
        icon: '#icon-bot-other',
        name: 'Checkout/Payments',
        url: '${MICRO_HOST_FRONTEND_COMMERCEOS}/business/{{BUSINESS_ID}}/checkout/9ead4e72-e7b3-5fed-901d-c734cde50972/panel-payments',
      },
    ],
  },


  // PAYEVER MAIL
  {
    _id: 'baa96848-3f16-46db-b326-fabf6376f865',
    icon: '#icon-bot-other',
    name: 'Mail',
    url: '',
    children: [
      {
        _id: '66a010ad-4372-4ea8-be8a-6d49ac6b6728',
        icon: '#icon-bot-other',
        name: 'Mail/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360023894714-How-to-setup-an-offer-via-mail',
      },
    ],
  },

  // PAYEVER AD
  // {
  //   _id: '5a6311f1-f1d7-4b3f-99a8-2179e1d239a9',
  //   icon: '#icon-bot-other',
  //   name: '',
  //   url: '',
  // },

  // PAYEVER SHIPPING
  {
    _id: '2e3581e9-d53b-42ae-af50-cc258cbd4278',
    icon: '#icon-bot-other',
    name: 'Shipping',
    url: '',
    children: [
      {
        _id: '7bcbff8f-2b96-43e5-81cf-d6f748c8c5c4',
        icon: '#icon-bot-other',
        name: 'Shipping/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360013519499-How-to-set-up-payever-Shipping',
      },
    ],
  },


  // PAYEVER TRANSACTIONS
  {
    _id: 'e8675843-9dc1-4d62-b984-16b936cf6115',
    icon: '#icon-bot-other',
    name: 'Transaction',
    url: '',
    children: [
      {
        _id: '0cc51665-4589-480d-b999-dd2ec591d99f',
        icon: '#icon-bot-other',
        name: 'Transaction/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360013450280-How-to-set-up-payever-Transactions',
      },
    ],
  },

  // PAYEVER CONNECT
  {
    _id: 'a1222919-25a7-4845-bccf-52b40a5822cd',
    icon: '#icon-bot-other',
    name: 'Connect',
    url: '',
    children: [
      {
        _id: '32758b93-fadc-4129-8ad0-58da852c0ec4',
        icon: '#icon-bot-other',
        name: 'Connect/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Connect',
      },
    ],
  },

  // PAYEVER CONTACTS
  {
    _id: 'b361243f-4112-4884-bccd-8cda6d02029d',
    icon: '#icon-bot-other',
    name: 'Contact',
    url: '',
    children: [
      {
        _id: '68997bcf-7794-4f2f-ace0-2e8e102969ad',
        icon: '#icon-bot-other',
        name: 'Contact/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360013519259-How-to-add-contacts',
      },
    ],
  },

  // PAYEVER STUDIO
  {
    _id: 'ef593178-6c75-4ff6-a608-a0e68685e90c',
    icon: '#icon-bot-other',
    name: 'Studio',
    url: '',
    children: [
      {
        _id: 'accbd95f-4dd9-489c-aa8a-6763995510e6',
        icon: '#icon-bot-other',
        name: 'Studio/Help',
        url: 'https://support.payever.org/hc/en-us/articles/360023894814-How-to-get-started-with-payever-Studio',
      },
    ],
  },
];
