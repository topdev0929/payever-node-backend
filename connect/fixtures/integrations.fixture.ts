// tslint:disable-next-line: no-commented-code
// tslint:disable: no-duplicate-string
// tslint:disable: quotemark
// tslint:disable: trailing-comma

/**
 * Sorted alphabetically by name and grouped by category
 */
import { IntegrationPrototype } from './integration-prototype.interface';

/* tslint:disable:object-literal-sort-keys */
// tslint:disable-next-line: no-commented-code
// tslint:disable: no-duplicate-string
// tslint:disable: trailing-comma
import { environment } from '../src/environments';

const TPPM_URL: string = '${MICRO_URL_THIRD_PARTY_PAYMENTS}/api';
const TPPLM_URL: string = '${MICRO_URL_THIRD_PARTY_PLUGINS}/api';
const INSTALLATION_IMAGES_URL: string = `${environment.microUrlCustomCdn}/images/installation`;
export const integrationsFixture: IntegrationPrototype[] = [

  /* ACCOUNTINGS */

  // debitoor
  {
    _id: '42591e16-259b-4fa0-8db6-ab4e0c08b607',
    name: 'debitoor',
    category: 'accountings',
    displayOptions: {
      _id: '3d62e48c-b700-485d-a87e-d3fa6ca9abce',
      icon: '#icon-debitoor-bw',
      title: 'Debitoor',
      bgColor: '#373737-#959595',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: 'f5bba795-8319-4786-af92-42fd75271376',
      links: [
        {
          _id: 'ed91f267-cadc-4e84-91eb-169c6b73608e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/accountings/debitoor.png`,
        },
      ],
      optionIcon: '#icon-debitoor-bw',
      price: 'Free',
      category: 'integrations.categories.Accounting',
      developer: 'payever GmbH',
      languages: 'English, German',
      description: 'integrations.debitoor.description',
      appSupport: 'https://payever.de/help/app-market/debitoor/',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://debitoor.de/funktionen/add-ons/zahlungsanbieter',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },


  /* COMMUNICATIONS */

  // device-payments
  {
    _id: '8e8537a9-c542-4be1-adfc-7563ae5c0d8c',
    name: 'device-payments',
    category: 'communications',
    displayOptions: {
      _id: '93410883-aa31-4886-81e5-3989da104fc7',
      icon: '#icon-communications-device-payments-white',
      title: 'integrations.communications.device-payments.title',
      bgColor: '#373737-#656566',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'a24e3ad8-9cff-4a66-bd59-d096b37e141c',
      links: [
        {
          _id: '5b83d3ae-8dc5-429a-a793-b8dc47ef612c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/communications/device-payments.png`,
        },
      ],
      optionIcon: '#icon-communications-device-payments-white',
      price: 'integrations.communications.device-payments.price',
      category: 'integrations.communications.device-payments.category',
      developer: 'integrations.communications.device-payments.developer',
      languages: 'integrations.communications.device-payments.languages',
      description: 'integrations.communications.device-payments.description',
      appSupport: 'integrations.communications.device-payments.appSupport_link',
      website: 'integrations.communications.device-payments.website_link',
      pricingLink: 'integrations.communications.device-payments.pricing_link',
    },
    createdAt: '2019-03-05T15:30:00.000+0000',
    updatedAt: '2019-03-05T15:30:00.000+0000',
  },

  // twilio
  {
    _id: '6fc2e9be-bc7e-4c14-9f88-d3f9ffce9ba5',
    name: 'twilio',
    category: 'communications',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/twilio/action/{action}',
        initEndpoint: '/business/{businessId}/integration/twilio/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api',
    },
    displayOptions: {
      _id: '84a7e4aa-8a39-4778-a8c7-28b7c908ba37',
      icon: '#icon-communication-twillio',
      title: 'integrations.communications.twilio.title',
      bgColor: '#DE434B-#FF4E57',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'a55e3e0a-edc7-4fe3-86ea-cbf630acb79c',
      links: [
        {
          _id: '3738f3e6-95e2-48f3-af86-46380376261c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/communications/twilio.png`,
        },
      ],
      optionIcon: '#icon-communication-twillio',
      price: 'integrations.communications.twilio.price',
      category: 'integrations.communications.twilio.category',
      developer: 'integrations.communications.twilio.developer',
      languages: 'integrations.communications.twilio.languages',
      description: 'integrations.communications.twilio.description',
      appSupport: 'integrations.communications.twilio.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.twilio.com/products',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // qr
  {
    _id: 'f2efd8c4-f3c3-4494-b70a-ba0cc5dc1c4d',
    name: 'qr',
    category: 'communications',
    displayOptions: {
      _id: '93410883-aa31-4886-81e5-3989da104fc7',
      icon: '#icon-communications-qr-white',
      title: 'integrations.communications.qr.title',
      bgColor: '#6DD8FF-#98FAFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'f2efd8c4-f3c3-4494-b70a-ba0cc5dc1c4d',
      links: [
        {
          _id: '151c7537-5688-471a-9820-a9b218fe73e8',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/communications/qrcode.png`,
        },
      ],
      optionIcon: '#icon-communications-qr-white',
      price: 'integrations.communications.qr.price',
      category: 'integrations.communications.qr.category',
      developer: 'integrations.communications.qr.developer',
      languages: 'integrations.communications.qr.languages',
      description: 'integrations.communications.qr.description',
      appSupport: 'integrations.communications.qr.appSupport_link',
      website: 'integrations.communications.qr.website_link',
      pricingLink: 'integrations.communications.qr.pricing_link',
    },
    extension: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/qr/action/{action}',
        endpoint: '/business/{businessId}/integration/qr/action/generate',
        initEndpoint: '/business/{businessId}/integration/qr/form',
        method: 'POST',
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },


  /* MESSAGING */

  // email
  {
    _id: '1ce96be7-77c0-44c1-917d-8237ef0e837f',
    name: 'email',
    category: 'messaging',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/email/action/{action}',
        initEndpoint: '/business/{businessId}/integration/email/form'
      },
      url: '${MICRO_URL_THIRD_PARTY_MESSENGER}/api'
    },
    displayOptions: {
      icon: '#icon-message-email',
      title: 'email',
    },
    installationOptions: {
      _id: '65e1977b-d9ce-4381-8aff-2af44745b197',
      countryList: [],
      links: [{
        type: 'img',
        url: '',
      }],
      optionIcon: '#icon-message-email',
      price: 'integrations.message.email.price',
      category: 'integrations.message.email.category',
      developer: 'integrations.message.email.developer',
      languages: 'integrations.message.email.languages',
      description: 'integrations.message.email.description',
      appSupport: 'integrations.message.email.support_link',
      website: 'https://getpayever.com/connect/',
    },
    createdAt: '2021-07-28T00:00:00.000+0000',
    updatedAt: '2021-07-28T00:00:00.000+0000',
  },

  // facebook-messenger
  {
    _id: '6fc2e9be-bc7e-4c14-9f88-d4f9ffce9ba4',
    name: 'facebook-messenger',
    category: 'messaging',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/facebook-messenger/action/{action}',
        initEndpoint: '/business/{businessId}/integration/facebook-messenger/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_MESSENGER}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-messaging-facebook-messenger',
      title: 'integrations.communications.facebook_messenger.title',
      bgColor: '#3A82FF-#FF7688',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/messaging/facebook.png`,
        },
      ],
      optionIcon: '#icon-messaging-facebook-messenger',
      price: 'integrations.messaging.facebook-messenger.price',
      category: 'integrations.messaging.facebook-messenger.category',
      developer: 'integrations.messaging.facebook-messenger.developer',
      languages: 'integrations.messaging.facebook-messenger.languages',
      description: 'integrations.messaging.facebook-messenger.description',
      appSupport: 'integrations.messaging.facebook-messenger.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.facebook.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // instagram-messenger
  {
    _id: 'aebfed9d-9d44-4b73-bb90-ea14db329084',
    name: 'instagram-messenger',
    category: 'messaging',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/instagram-messenger/action/{action}',
        initEndpoint: '/business/{businessId}/integration/instagram-messenger/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_MESSENGER}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-apps-instagram-28',
      title: 'integrations.communications.instagram_messenger.title',
      bgColor: '#3A82FF-#FF7688',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/messaging/instagram.png`,
        },
      ],
      optionIcon: '#icon-messaging-instagram-messenger',
      price: 'integrations.messaging.instagram-messenger.price',
      category: 'integrations.messaging.instagram-messenger.category',
      developer: 'integrations.messaging.instagram-messenger.developer',
      languages: 'integrations.messaging.instagram-messenger.languages',
      description: 'integrations.messaging.instagram-messenger.description',
      appSupport: 'integrations.messaging.instagram-messenger.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.instagram.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // live-chat
  {
    _id: '20b1800a-2340-4534-8b66-93574b0f679f',
    name: 'live-chat',
    category: 'messaging',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/live-chat/action/{action}',
        initEndpoint: '/business/{businessId}/integration/live-chat/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_MESSENGER}/api',
    },
    displayOptions: {
      _id: '2b27eab6-8fbb-49a4-89e1-3eebce1160c2',
      icon: '#icon-apps-live-chat-28',
      title: 'integrations.communciations.livechat.title',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'bcf6cbde-cd32-4705-8df4-625ca2c267f0',
      links: [
        {
          _id: '85b46f16-0ac3-4b46-b154-bcaeae66542c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/messaging/livechat.png`,
        },
      ],
      optionIcon: '#icon-messaging-live-chat',
      price: 'integrations.messaging.live-chat.price',
      category: 'integrations.messaging.live-chat.category',
      developer: 'integrations.messaging.live-chat.developer',
      languages: 'integrations.messaging.live-chat.languages',
      description: 'integrations.messaging.live-chat.description',
      appSupport: 'integrations.messaging.live-chat.support_link',
      website: 'https://getpayever.com/connect/',
    },
    createdAt: '2021-06-10T11:02:01.339+0000',
    updatedAt: '2021-06-10T11:02:01.339+0000',
  },

  // whatsapp
  {
    _id: '30cf03b1-3df4-4862-8418-b1961e33c27c',
    name: 'whatsapp',
    category: 'messaging',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/whatsapp/action/{action}',
        initEndpoint: '/business/{businessId}/integration/whatsapp/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_MESSENGER}/api',
    },
    displayOptions: {
      _id: 'fdb5eab4-0cc9-4461-98b4-524fb8b04468',
      icon: '#icon-messaging-whatsapp',
      title: 'integrations.communications.whatsapp.title',
      bgColor: '#56B04C-#86E87E',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '6a93eb16-7e2f-4430-b612-d6b3e42442fa',
      links: [
        {
          _id: '21befb5e-42ce-4657-a5c2-54c019d43872',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/messaging/whatsapp.png`,
        },
      ],
      optionIcon: '#icon-messaging-whatsapp',
      price: 'integrations.messaging.whatsapp.price',
      category: 'integrations.messaging.whatsapp.category',
      developer: 'integrations.messaging.whatsapp.developer',
      languages: 'integrations.messaging.whatsapp.languages',
      description: 'integrations.messaging.whatsapp.description',
      appSupport: 'integrations.messaging.whatsapp.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.whatsapp.com/',
    },
    createdAt: '2021-03-22T13:02:01.339+0000',
    updatedAt: '2021-03-22T13:02:01.339+0000',
  },


  /* PAYMENTS */

  // apple_pay
  {
    _id: '3b66ea10-b378-4539-a21d-382c4549825d',
    name: 'apple_pay',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/apple_pay/action/{action}',
        initEndpoint: '/business/{businessId}/integration/apple_pay/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '5cd93008-92f8-11eb-a8b3-0242ac130003',
      icon: '#payment-option-apple_pay',
      title: 'integrations.payments.apple_pay.title',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      _id: '79e704ea-92f8-11eb-a8b3-0242ac130003',
      countryList: [],
      links: [
        {
          _id: '7f849228-92f8-11eb-a8b3-0242ac130003',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/apple-pay.png`,
        },
      ],
      optionIcon: '#icon-payment-option-apple_pay',
      appSupport: 'integrations.payments.apple_pay.support_link',
      category: 'integrations.payments.apple_pay.category',
      description: 'integrations.payments.apple_pay.description',
      developer: 'integrations.payments.apple_pay.developer',
      languages: 'integrations.payments.apple_pay.languages',
      price: 'integrations.payments.apple_pay.price',
      pricingLink: 'integrations.payments.apple_pay.pricing_link',
      website: 'integrations.payments.apple_pay.website_link',
    },
    createdAt: '2021-04-01T17:43:00.000+0000',
    updatedAt: '2021-04-01T17:43:00.000+0000',
  },

  // billing-subscriptions
  {
    _id: '6b798e21-9457-436f-b55a-295c86de1b8a',
    name: 'billing-subscriptions',
    category: 'payments',
    displayOptions: {
      _id: '0a2cf765-71a4-4a07-9ef2-bdbf2583e5a7',
      icon: '#icon-subscriptions',
      title: 'Subscriptions',
      bgColor: '#828B93-#AFBCC7',
    },
    extension: {
      formAction: {
        'endpoint': '/settings/{businessId}/form',
        'method': 'POST',
      },
      url: '${MICRO_URL_BILLING_SUBSCRIPTION}/api',
    },
    enabled: true,
    installationOptions: {
      _id: '6e0cf1f4-963d-4570-9629-7b544bdf9e8d',
      appSupport: 'integrations.payments.subscriptions.support_link',
      category: 'integrations.payments.subscriptions.category',
      countryList: [],
      description: 'integrations.payments.subscriptions.description',
      developer: 'integrations.payments.subscriptions.developer',
      languages: 'integrations.payments.subscriptions.languages',
      links: [
        {
          _id: 'defd15f9-7593-417a-b296-12dce939d67b',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/subscriptions.png`,
        },
      ],
      optionIcon: '#icon-subscriptions',
      price: 'integrations.payments.subscriptions.price',
      pricingLink: 'integrations.payments.subscriptions.pricing_link',
      website: 'integrations.payments.subscriptions.website_link',
    },
    createdAt: '2020-01-10T18:00:00.000+0000',
    updatedAt: '2020-01-10T19:00:00.000+0000',
  },

  // cash
  {
    _id: 'ffb0b18f-dbce-4ca8-b9e7-905f67bb7ba3',
    name: 'cash',
    category: 'payments',
    displayOptions: {
      _id: 'e80b134a-15f6-4396-ae65-a4360ab64a6e',
      icon: '#payment-method-cash-2',
      title: 'integrations.payments.cash.title',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE'
      ],
      _id: '9a86e4a9-9ed9-43de-8ca4-fd6b8d39f7b7',
      links: [
        {
          _id: 'ee823c90-056f-4f0e-b58f-b4edb2738a3b',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/wiretransfer.png`,
        },
      ],
      optionIcon: '#payment-method-cash-2',
      price: 'integrations.payments.cash.price',
      category: 'integrations.payments.cash.category',
      developer: 'integrations.payments.cash.developer',
      languages: 'integrations.payments.cash.languages',
      description: 'integrations.payments.cash.description',
      appSupport: 'integrations.payments.cash.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://transferwise.com/pricing/',
    },
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/cash/action/{action}',
        initEndpoint: '/business/{businessId}/integration/cash/form',
      },
      url: TPPM_URL,
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // google_pay
  {
    _id: '97b01902-be0f-11eb-8529-0242ac130003',
    name: 'google_pay',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/google_pay/action/{action}',
        initEndpoint: '/business/{businessId}/integration/google_pay/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'ac00e8aa-be0f-11eb-8529-0242ac130003',
      icon: '#payment-method-google_pay-tr',
      title: 'integrations.payments.google_pay.title',
    },
    enabled: true,
    installationOptions: {
      _id: 'f9255dea-be10-11eb-8529-0242ac130003',
      countryList: [],
      links: [
        {
          _id: 'b492a8d2-be0f-11eb-8529-0242ac130003',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/google-pay.png`,
        },
      ],
      optionIcon: '#icon-payment-option-google_pay',
      appSupport: 'integrations.payments.google_pay.support_link',
      category: 'integrations.payments.google_pay.category',
      description: 'integrations.payments.google_pay.description',
      developer: 'integrations.payments.google_pay.developer',
      languages: 'integrations.payments.google_pay.languages',
      price: 'integrations.payments.google_pay.price',
      pricingLink: 'integrations.payments.google_pay.pricing_link',
      website: 'integrations.payments.google_pay.website_link',
    },
    createdAt: '2021-05-26T13:46:00.000+0000',
    updatedAt: '2021-05-26T13:46:00.000+0000',
  },

  // instant_payment
  {
    _id: 'c6c5eef8-9307-434f-9156-aaf9a6cd02c3',
    name: 'instant_payment',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/instant_payment/action/{action}',
        initEndpoint: '/business/{businessId}/integration/instant_payment/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'c2aebb9a-8ad5-468b-a12d-df37515068a1',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.instant_payment.title',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      _id: '6dbce1a7-268f-44ec-92d3-3fbc37b75069',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: '53d6f7f7-5644-49bf-ab4b-a0fc6a412305',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/instant-payment.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      appSupport: 'integrations.payments.instant_payment.support_link',
      category: 'integrations.payments.instant_payment.category',
      description: 'integrations.payments.instant_payment.description',
      developer: 'integrations.payments.instant_payment.developer',
      languages: 'integrations.payments.instant_payment.languages',
      price: 'integrations.payments.instant_payment.price',
      pricingLink: 'integrations.payments.instant_payment.pricing_link',
      website: 'integrations.payments.instant_payment.website_link',
    },
    createdAt: '2020-02-14T10:00:00.000+0000',
    updatedAt: '2020-02-14T10:00:00.000+0000',
  },

  // payex_creditcard
  {
    _id: 'bbb90b8b-b0cf-46d3-b9dc-075fabd5566f',
    name: 'payex_creditcard',
    category: 'payments',
    displayOptions: {
      _id: '533d396d-1fac-4ce6-8863-bd2de8aa232b',
      icon: '#icon-payment-option-payex',
      title: 'integrations.payments.payex_creditcard.title',
      bgColor: '#62B85B-#36A645',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'SE',
        'DK',
        'NO'
      ],
      _id: '0a6eb73c-51df-4ca8-a4cd-b1778fad4e75',
      links: [
        {
          _id: '834d2274-6f4f-4149-9cd7-004859448eca',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/payex.png`,
        },
      ],
      optionIcon: '#icon-payment-option-payex',
      price: 'integrations.payments.payex_creditcard.price',
      category: 'integrations.payments.payex_creditcard.category',
      developer: 'integrations.payments.payex_creditcard.developer',
      languages: 'integrations.payments.payex_creditcard.languages',
      description: 'integrations.payments.payex_creditcard.description',
      appSupport: 'integrations.payments.payex_creditcard.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://payex.com/products/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // payex_faktura
  {
    _id: '3f4c1c9d-364c-46c5-8194-ff8b03d18c95',
    name: 'payex_faktura',
    category: 'payments',
    displayOptions: {
      _id: '2c8a5d24-6958-4d66-810b-935c20194014',
      icon: '#icon-payment-option-payex',
      title: 'PayEx Invoice / Faktura',
      bgColor: '#62B85B-#36A645',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'SE'
      ],
      _id: '42be0924-9b99-4948-8dd7-4a6dd9eaeb56',
      links: [
        {
          _id: 'fef60a1d-5a75-4f3d-a34e-f885baf43005',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/payex.png`,
        },
      ],
      optionIcon: '#icon-payment-option-payex',
      price: 'integrations.payments.payex_faktura.price',
      category: 'integrations.payments.payex_faktura.category',
      developer: 'integrations.payments.payex_faktura.developer',
      languages: 'integrations.payments.payex_faktura.languages',
      description: 'integrations.payments.payex_faktura.description',
      appSupport: 'integrations.payments.payex_faktura.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://payex.com/products/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // paypal
  {
    _id: '044aace0-866c-4221-b37a-dccf9a8c5cd5',
    name: 'paypal',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/paypal/action/{action}',
        initEndpoint: '/business/{businessId}/integration/paypal/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'b135c015-d2ca-4df2-bc60-78a786738280',
      icon: '#icon-payment-option-paypall',
      title: 'integrations.payments.paypal.title',
      bgColor: '#39B0F0-#3CB9FF',
    },
    enabled: true,
    installationOptions: {
      _id: '8d6ae90d-8929-4fde-9846-91c1a1d8b9b7',
      appSupport: 'integrations.payments.paypal.support_link',
      category: 'integrations.payments.paypal.category',
      countryList: [],
      description: 'integrations.payments.paypal.description',
      developer: 'integrations.payments.paypal.developer',
      languages: 'integrations.payments.paypal.languages',
      links: [
        {
          _id: '9a3bc967-4273-4705-b6db-6b6b44c7462a',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/paypal.png`,
        },
      ],
      optionIcon: '#icon-payment-option-paypal',
      price: 'integrations.payments.paypal.price',
      pricingLink: 'https://www.paypal.com/de/webapps/mpp/accept-payments-online#feeCalculator',
      website: 'https://getpayever.com/checkout/',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // santander_ccp_installment
  {
    _id: '4d5ea0fb-2991-4495-9d38-d58f1961c8ef',
    name: 'santander_ccp_installment',
    category: 'payments',
    displayOptions: {
      _id: '99cbd872-52c0-48bb-8d7f-92a81bf282fa',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_ccp_installment.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE'
      ],
      _id: 'dcdf72b3-4720-4e87-a756-e45b39d656ea',
      links: [
        {
          _id: '7e886331-be7f-4d97-9675-582a3cbf1479',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_ccp_installment.price',
      category: 'integrations.payments.santander_ccp_installment.category',
      developer: 'integrations.payments.santander_ccp_installment.developer',
      languages: 'integrations.payments.santander_ccp_installment.languages',
      description: 'integrations.payments.santander_ccp_installment.description',
      appSupport: 'integrations.payments.santander_ccp_installment.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santander.de/firmenkunden/waren/stationaere-haendler/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_factoring_de
  {
    _id: 'bce8ef2c-e88c-4066-acb0-1154bb995efc',
    name: 'santander_factoring_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_factoring_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_factoring_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '5e1b2f33-e97e-4b5b-bbea-64ffb922a953',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_factoring_de.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: '9b78f15c-0142-4a8b-ad49-42973f096d32',
      appSupport: 'integrations.payments.santander_factoring_de.support_link',
      category: 'integrations.payments.santander_factoring_de.category',
      countryList: [
        'DE'
      ],
      description: 'integrations.payments.santander_factoring_de.description',
      developer: 'integrations.payments.santander_factoring_de.developer',
      languages: 'integrations.payments.santander_factoring_de.languages',
      links: [
        {
          _id: '8727db55-4942-4d0e-9165-8df0d8e51b2c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_factoring_de.price',
      pricingLink: 'integrations.payments.santander_factoring_de.pricing_link',
      website: 'integrations.payments.santander_factoring_de.website_link',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // santander_installment
  {
    _id: '459891bb-78e3-413e-b874-acbdcaef85d6',
    name: 'santander_installment',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_installment/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '2e28e2f4-f9be-45c1-b492-832aa9533141',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE',
      ],
      _id: '0a65f64d-fd04-4966-8944-ca92a4798f5d',
      links: [
        {
          _id: '28eb05c4-cf30-4469-beb8-f0c9ec1634bc',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_installment.price',
      category: 'integrations.payments.santander_installment.category',
      developer: 'integrations.payments.santander_installment.developer',
      languages: 'integrations.payments.santander_installment.languages',
      description: 'integrations.payments.santander_installment.description',
      appSupport: 'integrations.payments.santander_installment.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santander.de/firmenkunden/waren/stationaere-haendler/',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // santander_installment_at
  {
    _id: '9542bd3d-e0f4-4b83-b4bc-e320083e5137',
    name: 'santander_installment_at',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_installment_at/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_at/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '3f04b5cc-7ba0-4ae2-9658-0c5a051dc496',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment_at.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: 'c80e509c-ef0b-41d1-b616-d080ddef3079',
      countryList: [
        'AT'
      ],
      links: [
        {
          _id: '8a754702-a4e5-4e79-be10-957b6f90be4e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-austria.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      appSupport: 'integrations.payments.santander_installment_at.support_link',
      category: 'integrations.payments.santander_installment_at.category',
      description: 'integrations.payments.santander_installment_at.description',
      developer: 'integrations.payments.santander_installment_at.developer',
      languages: 'integrations.payments.santander_installment_at.languages',
      price: 'integrations.payments.santander_installment_at.price',
      pricingLink: 'integrations.payments.santander_installment_at.pricing_link',
      website: 'integrations.payments.santander_installment_at.website_link',
    },
    createdAt: '2020-10-30T09:00:00.000+0000',
    updatedAt: '2020-10-30T09:00:00.000+0000',
  },

  // santander_installment_dk
  {
    _id: 'e0a808f4-af26-48e5-bb17-8fe083d94dd8',
    name: 'santander_installment_dk',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_installment_dk/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_dk/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'e4f84edf-5dda-4556-b685-f36529f977ef',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment_dk.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: ['DK'],
      _id: '3f43b2b9-ff9e-42ae-916a-f09c5f445dc2',
      links: [
        {
          _id: '6a3d0414-d802-46d5-b4f2-4b6d19e45bfa',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-denmark.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_installment_dk.price',
      category: 'integrations.payments.santander_installment_dk.category',
      developer: 'integrations.payments.santander_installment_dk.developer',
      languages: 'integrations.payments.santander_installment_dk.languages',
      description: 'integrations.payments.santander_installment_dk.description',
      appSupport: 'integrations.payments.santander_installment_dk.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://santanderconsumer.dk/partnere/salgsfinansiering/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_installment_fi
  {
    _id: '88fd29c7-9bf1-432c-8be4-1b514f6365e3',
    name: 'santander_installment_fi',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/santander_installment_fi/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_fi/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '36daaf3b-5e14-4587-9fe2-851ae563dbb3',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment_fi.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: '56ca8654-816a-426a-85fc-8a9542dc15bd',
      countryList: ['FI'],
      links: [
        {
          _id: 'f6d4b70d-7253-4be6-80df-d82c86da6dc6',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-finland.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',

      appSupport: 'integrations.payments.santander_installment_fi.support_link',
      category: 'integrations.payments.santander_installment_fi.category',
      description: 'integrations.payments.santander_installment_fi.description',
      developer: 'integrations.payments.santander_installment_fi.developer',
      languages: 'integrations.payments.santander_installment_fi.languages',
      price: 'integrations.payments.santander_installment_fi.price',
      pricingLink: 'integrations.payments.santander_installment_fi.pricing_link',
      website: 'integrations.payments.santander_installment_fi.website_link',
    },
    createdAt: '2022-01-18T18:13:00.000+0000',
    updatedAt: '2022-01-18T18:13:00.000+0000',
  },

  // santander_installment_nl
  {
    _id: '86fe067d-7184-4b31-9c04-ce30709efd34',
    name: 'santander_installment_nl',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_installment_nl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_nl/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '92ef46bb-d925-499d-ae56-909a87370c57',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment_nl.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: 'b562cbf0-817a-4b8f-b5d1-dfab8e61725a',
      countryList: [
        'NL'
      ],
      links: [
        {
          _id: 'c13d2da4-a679-4aab-be0b-906d2621b071',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-netherlands.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      appSupport: 'integrations.payments.santander_installment_nl.support_link',
      category: 'integrations.payments.santander_installment_nl.category',
      description: 'integrations.payments.santander_installment_nl.description',
      developer: 'integrations.payments.santander_installment_nl.developer',
      languages: 'integrations.payments.santander_installment_nl.languages',
      price: 'integrations.payments.santander_installment_nl.price',
      pricingLink: 'integrations.payments.santander_installment_nl.pricing_link',
      website: 'integrations.payments.santander_installment_nl.website_link',
    },
    createdAt: '2020-06-15T09:00:00.000+0000',
    updatedAt: '2020-06-15T09:00:00.000+0000',
  },

  // santander_installment_no
  {
    _id: 'a58d24eb-271d-4c00-9793-73c0f746e6fa',
    name: 'santander_installment_no',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_installment_no/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_no/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '54993dae-d187-4726-ae3b-33be49093827',
      icon: '#icon-payment-option-santander',
      title: 'Santander Installment / BuyNowPayLater',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: ['NO'],
      _id: 'acc202f5-58cb-43b8-b421-64a453aea649',
      links: [
        {
          _id: 'cd5d0b54-ba1e-4ee9-95ac-97287e3c4f83',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-norway.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'No monthly fees. Pay per transaction.',
      category: 'payments',
      developer: 'payever GmbH',
      languages: 'English',
      description:
        'With Santander installment inside payever you can accept part payments.\n           Raise the average size of your baskets by offering this payment option to your customers.',
      appSupport: 'https://getpayever.com/payments/',
      website: 'https://getpayever.com/checkout/',
      pricingLink:
        'https://www.santanderconsumer.no/handlekonto/handlekonto/forhandlerinfo/'
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_installment_se
  {
    _id: '890af3f9-6b31-4bc4-a2fa-f386c64a7616',
    name: 'santander_installment_se',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_installment_se/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_se/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '64f5ab45-e6da-4dc0-9996-287cfc22f4f8',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment_se.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: ['SE'],
      _id: '1f9bc71f-64db-4252-846c-949ef6f19d82',
      links: [
        {
          _id: '51d1b336-d5a2-4281-af8f-a3005cc8d3c8',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-sweden.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_installment_se.price',
      category: 'integrations.payments.santander_installment_se.category',
      developer: 'integrations.payments.santander_installment_se.developer',
      languages: 'integrations.payments.santander_installment_se.languages',
      description: 'integrations.payments.santander_installment_se.description',
      appSupport: 'integrations.payments.santander_installment_se.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santanderconsumer.se',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_installment_uk
  {
    _id: '9e9c07ed-463d-4336-8639-644ee7a5341a',
    name: 'santander_installment_uk',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/santander_installment_uk/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_uk/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '1a8f9cb7-794d-453c-af54-35062bac1b87',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_installment_uk.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: '3d4eab99-5d26-4f60-a4b7-a62ee4a34e04',
      countryList: ['GB'],
      links: [
        {
          _id: 'dd74e139-dc0a-4d59-be65-ddb60969ac0a',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-united-kingdom.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',

      appSupport: 'integrations.payments.santander_installment_uk.support_link',
      category: 'integrations.payments.santander_installment_uk.category',
      description: 'integrations.payments.santander_installment_uk.description',
      developer: 'integrations.payments.santander_installment_uk.developer',
      languages: 'integrations.payments.santander_installment_uk.languages',
      price: 'integrations.payments.santander_installment_uk.price',
      pricingLink: 'integrations.payments.santander_installment_uk.pricing_link',
      website: 'integrations.payments.santander_installment_uk.website_link',
    },
    createdAt: '2021-08-16T18:00:00.000+0000',
    updatedAt: '2021-08-16T18:00:00.000+0000',
  },

  // santander_invoice_de
  {
    _id: '49fe6119-cd82-43eb-acc9-2e09422feab8',
    name: 'santander_invoice_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_invoice_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_invoice_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'f2471edd-fd77-486a-acaf-37c856735831',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_invoice_de.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: '84b5ca5d-cca3-4104-8203-80e83b53ddbb',
      appSupport: 'integrations.payments.santander_invoice_de.support_link',
      category: 'integrations.payments.santander_invoice_de.category',
      countryList: [
        'DE'
      ],
      description: 'integrations.payments.santander_invoice_de.description',
      developer: 'integrations.payments.santander_invoice_de.developer',
      languages: 'integrations.payments.santander_invoice_de.languages',
      links: [
        {
          _id: '2aaaa493-31ba-4924-aea2-7e3bf0ffe51c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_invoice_de.price',
      pricingLink: 'https://www.santander.de/firmenkunden/waren/stationaere-haendler/',
      website: 'https://getpayever.com/checkout/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_invoice_no
  {
    _id: '61875708-6645-4113-bd14-a8ada52075ff',
    name: 'santander_invoice_no',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_invoice_no/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_invoice_no/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'f48fb287-166e-422e-94d0-458b96156277',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_invoice_no.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'NO'
      ],
      _id: '8d27b74f-dc39-4ce2-9b46-199b017cb644',
      links: [
        {
          _id: 'd6c69391-41db-45a7-97b8-a3148df4f5dd',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-norway.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_invoice_no.price',
      category: 'integrations.payments.santander_invoice_no.category',
      developer: 'integrations.payments.santander_invoice_no.developer',
      languages: 'integrations.payments.santander_invoice_no.languages',
      description: 'integrations.payments.santander_invoice_no.description',
      appSupport: 'integrations.payments.santander_invoice_no.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santanderconsumer.no/handlekonto/handlekonto/forhandlerinfo/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_pos_factoring_de
  {
    _id: '451b2853-565f-4d39-94f5-6e8945f738ee',
    name: 'santander_pos_factoring_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_pos_factoring_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_factoring_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '3f32565b-b5ca-42e9-a402-c3cd347162c6',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_factoring_de.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: 'cd57a9c0-7243-4ff2-8bc4-f315cc8d35eb',
      appSupport: 'integrations.payments.santander_pos_factoring_de.support_link',
      category: 'integrations.payments.santander_pos_factoring_de.category',
      countryList: [
        'DE'
      ],
      description: 'integrations.payments.santander_pos_factoring_de.description',
      developer: 'integrations.payments.santander_pos_factoring_de.developer',
      languages: 'integrations.payments.santander_pos_factoring_de.languages',
      links: [
        {
          _id: '14f28240-4a08-4df2-b654-4d11b0d66911',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_pos_factoring_de.price',
      pricingLink: 'integrations.payments.santander_pos_factoring_de.pricing_link',
      website: 'integrations.payments.santander_pos_factoring_de.website_link',
    },
    createdAt: '2019-04-23T15:00:00.000+0000',
    updatedAt: '2019-04-23T15:00:00.000+0000',
  },

  // santander_pos_installment
  {
    _id: '8614f07d-2b28-4221-8282-5226c8cc26c5',
    name: 'santander_pos_installment',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_pos_installment/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_installment/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'b2d04e7e-a508-4eb5-823c-e8d8180e26ac',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_installment.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE'
      ],
      _id: 'a8efd833-4966-42e1-b81c-0343c19f1e2b',
      links: [
        {
          _id: 'bd528bde-8b92-45db-8e21-1282f6c007e7',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_pos_installment.price',
      category: 'integrations.payments.santander_pos_installment.category',
      developer: 'integrations.payments.santander_pos_installment.developer',
      languages: 'integrations.payments.santander_pos_installment.languages',
      description: 'integrations.payments.santander_pos_installment.description',
      appSupport: 'integrations.payments.santander_pos_installment.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santander.de/firmenkunden/waren/stationaere-haendler/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_pos_installment_dk
  {
    _id: '0111517d-9334-4b73-9266-5de5293d984f',
    name: 'santander_pos_installment_dk',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_pos_installment_dk/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_installment_dk/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '1be8005f-1148-4cb6-b33a-137b8cce5866',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_installment_dk.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: ['DK'],
      _id: '9f4f9da7-b037-4c21-8c53-c7fefb5cf20a',
      links: [
        {
          _id: 'dac33e60-1b09-405c-910e-60f03236e671',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-denmark-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_pos_installment_dk.price',
      category: 'integrations.payments.santander_pos_installment_dk.category',
      developer: 'integrations.payments.santander_pos_installment_dk.developer',
      languages: 'integrations.payments.santander_pos_installment_dk.languages',
      description: 'integrations.payments.santander_pos_installment_dk.description',
      appSupport: 'integrations.payments.santander_pos_installment_dk.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://santanderconsumer.dk/partnere/salgsfinansiering/',
    },
    createdAt: '2022-02-14T17:17:41.340+0000',
    updatedAt: '2022-02-14T17:17:41.340+0000',
  },

  // santander_pos_installment_fi
  {
    _id: '10cc3a1e-3385-4c05-afce-2dec9aa8dee0',
    name: 'santander_pos_installment_fi',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/santander_pos_installment_fi/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_installment_fi/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '354dbcb4-c2fe-46a0-88fc-5c11d61aa9b3',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_installment_fi.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: '6616419b-b54e-4fec-8cd1-4dd68bf90a19',
      countryList: ['FI'],
      links: [
        {
          _id: 'e1f5c537-9af4-44b6-9aed-a57d51f816a2',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-finland-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',

      appSupport: 'integrations.payments.santander_pos_installment_fi.support_link',
      category: 'integrations.payments.santander_pos_installment_fi.category',
      description: 'integrations.payments.santander_pos_installment_fi.description',
      developer: 'integrations.payments.santander_pos_installment_fi.developer',
      languages: 'integrations.payments.santander_pos_installment_fi.languages',
      price: 'integrations.payments.santander_pos_installment_fi.price',
      pricingLink: 'integrations.payments.santander_pos_installment_fi.pricing_link',
      website: 'integrations.payments.santander_pos_installment_fi.website_link',
    },
    createdAt: '2022-01-18T18:13:00.000+0000',
    updatedAt: '2022-01-18T18:13:00.000+0000',
  },

  // santander_pos_installment_no
  {
    _id: 'c0506dcb-3dd4-4b85-81f9-dae7f7cb96d2',
    name: 'santander_pos_installment_no',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_pos_installment_no/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_installment_no/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '97905621-e6f9-4e9e-9a3f-176d647713e8',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_installment_no.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: ['NO'],
      _id: '5b92cf71-96df-4259-9ce4-680f4416c07f',
      links: [
        {
          _id: 'b7baeed8-ee90-4460-b226-b73c4a2a6fee',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-norway-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_pos_installment_no.price',
      category: 'integrations.payments.santander_pos_installment_no.category',
      developer: 'integrations.payments.santander_pos_installment_no.developer',
      languages: 'integrations.payments.santander_pos_installment_no.languages',
      description: 'integrations.payments.santander_pos_installment_no.description',
      appSupport: 'https://getpayever.com/payments/',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santanderconsumer.no/handlekonto/handlekonto/forhandlerinfo/'
    },
    createdAt: '2022-02-22T17:39:00.000+0000',
    updatedAt: '2022-02-22T17:39:00.000+0000',
  },

  // santander_pos_installment_se
  {
    _id: '45235418-6645-4113-bd14-a8ada52075ff',
    name: 'santander_pos_installment_se',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_pos_installment_se/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_installment_se/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'f49fb567-160e-422e-94d0-458b96156277',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_installment_se.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'SE'
      ],
      _id: 'abc7b74f-dc39-4ce2-9b46-199b017cb644',
      links: [
        {
          _id: 'ada69391-42db-45a7-97b8-a3148df4f5dd',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-sweden-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_pos_installment_se.price',
      category: 'integrations.payments.santander_pos_installment_se.category',
      developer: 'integrations.payments.santander_pos_installment_se.developer',
      languages: 'integrations.payments.santander_pos_installment_se.languages',
      description: 'integrations.payments.santander_pos_installment_se.description',
      appSupport: 'integrations.payments.santander_pos_installment_se.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://www.santander.de/firmenkunden/waren/stationaere-haendler/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // santander_pos_installment_uk
  {
    _id: 'a104873f-5a1c-4304-a946-5fc090649ce9',
    name: 'santander_pos_installment_uk',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/santander_pos_installment_uk/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_installment_uk/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'e12fcd27-b80e-44ec-a3ac-63986534938e',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_installment_uk.title',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: true,
    installationOptions: {
      _id: '16f62c9e-cfae-48c0-8d1b-00c8658e71b5',
      countryList: ['GB'],
      links: [
        {
          _id: '969828d1-feac-4c88-ae34-d68e6615c00b',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-united-kingdom-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',

      appSupport: 'integrations.payments.santander_pos_installment_uk.support_link',
      category: 'integrations.payments.santander_pos_installment_uk.category',
      description: 'integrations.payments.santander_pos_installment_uk.description',
      developer: 'integrations.payments.santander_pos_installment_uk.developer',
      languages: 'integrations.payments.santander_pos_installment_uk.languages',
      price: 'integrations.payments.santander_pos_installment_uk.price',
      pricingLink: 'integrations.payments.santander_pos_installment_uk.pricing_link',
      website: 'integrations.payments.santander_pos_installment_uk.website_link',
    },
    createdAt: '2021-12-07T15:21:00.000+0000',
    updatedAt: '2021-12-07T15:21:00.000+0000',
  },

  // santander_pos_invoice_de
  {
    _id: 'c91204e5-ce79-499c-b863-90443e3ce567',
    name: 'santander_pos_invoice_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/santander_pos_invoice_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_pos_invoice_de/form',
      },
      url: TPPM_URL,
    },
    enabled: true,
    displayOptions: {
      _id: '48d51a88-101d-431a-a30c-17d2c460f133',
      icon: '#icon-payment-option-santander',
      title: 'integrations.payments.santander_pos_invoice_de.title',
      bgColor: '#EA1E27-#A71E27',
    },
    installationOptions: {
      _id: '807b71c1-24c1-4061-b03f-b7c1da197c0f',
      appSupport: 'integrations.payments.santander_pos_invoice_de.support_link',
      category: 'integrations.payments.santander_pos_invoice_de.category',
      countryList: [
        'DE'
      ],
      description: 'integrations.payments.santander_pos_invoice_de.description',
      developer: 'integrations.payments.santander_pos_invoice_de.developer',
      languages: 'integrations.payments.santander_pos_invoice_de.languages',
      links: [
        {
          _id: '9470f49c-c8c5-40c4-a44e-aa90a9495575',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-germany-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander',
      price: 'integrations.payments.santander_pos_invoice_de.price',
      pricingLink: 'integrations.payments.santander_pos_invoice_de.pricing_link',
      website: 'integrations.payments.santander_pos_invoice_de.website_link',
    },
    createdAt: '2019-04-23T15:00:00.000+0000',
    updatedAt: '2019-04-23T15:00:00.000+0000',
  },

  // sofort
  {
    _id: '297fec46-eabe-40bc-8246-16dd9c518d09',
    name: 'sofort',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/sofort/action/{action}',
        initEndpoint: '/business/{businessId}/integration/sofort/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'b8ccb2d3-021f-498b-a844-7f7f60382614',
      icon: '#icon-payment-option-sofort',
      title: 'Sofortüberweisung',
      bgColor: '#ED8000-#FF8A01',
    },
    enabled: true,
    installationOptions: {
      _id: 'b3971f58-e326-4feb-a0de-5fd85b789c40',
      appSupport: 'integrations.payments.sofort.support_link',
      category: 'integrations.payments.sofort.category',
      countryList: [
        'DE',
        'AT',
        'CH',
        'GB',
        'ES',
        'FR',
        'HU',
        'IT',
        'NL',
        'PL',
        'UK',
        'CZ',
        'SK'
      ],
      description: 'integrations.payments.sofort.description',
      developer: 'integrations.payments.sofort.developer',
      languages: 'integrations.payments.sofort.languages',
      links: [
        {
          _id: 'd64d7f92-91da-4845-9644-270dacfc086a',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/sofort.png`,
        },
      ],
      optionIcon: '#icon-payment-option-sofort',
      price: 'integrations.payments.sofort.price',
      pricingLink: 'https://www.klarna.com/sofort/business/mit-sofort-verkaufen/',
      website: 'https://getpayever.com/checkout/',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // stripe
  {
    _id: '4b5976ac-3c78-4e44-ba0d-719c34cd0d46',
    name: 'stripe',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/stripe/action/{action}',
        initEndpoint: '/business/{businessId}/integration/stripe/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'd761163c-f88a-427a-82ff-0c644e5a4570',
      icon: '#icon-payment-option-stripe',
      title: 'integrations.payments.stripe.title',
      bgColor: '#59AFF9-#6755FF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'f5a05da6-db18-43db-b3ac-6ff98b2c6e0a',
      wrapperType: 'credit_card',
      links: [
        {
          _id: '945aa791-fa84-4aa1-9536-d993793c5b23',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/stripe.png`,
        },
      ],
      optionIcon: '#icon-payment-option-stripe',
      price: 'integrations.payments.stripe.price',
      category: 'integrations.payments.stripe.category',
      developer: 'integrations.payments.stripe.developer',
      languages: 'integrations.payments.stripe.languages',
      description: 'integrations.payments.stripe.description',
      appSupport: 'integrations.payments.stripe.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://stripe.com/de/pricing',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // stripe_directdebit
  {
    _id: '266bea2e-ae61-4d75-802e-6320416010f4',
    name: 'stripe_directdebit',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/stripe_directdebit/action/{action}',
        initEndpoint: '/business/{businessId}/integration/stripe_directdebit/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'a18c60df-ffa2-41cb-9ee8-2bc5d3381a91',
      icon: '#icon-payment-option-stripe-direct-debit',
      title: 'integrations.payments.stripe_directdebit.title',
      bgColor: '#59AFF9-#6755FF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'b351dab8-8261-495d-afbd-00e2a3c337f1',
      links: [
        {
          _id: '3f11a3d1-ec44-4121-8bc3-39cfa461878c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/stripe-directdebit.png`,
        },
      ],
      optionIcon: '#icon-payment-option-stripe-direct-debit',
      price: 'integrations.payments.stripe_directdebit.price',
      category: 'integrations.payments.stripe_directdebit.category',
      developer: 'integrations.payments.stripe_directdebit.developer',
      languages: 'integrations.payments.stripe_directdebit.languages',
      description: 'integrations.payments.stripe_directdebit.description',
      appSupport: 'integrations.payments.stripe_directdebit.support_link',
      website: 'https://getpayever.com/checkout/',
      pricingLink: 'https://stripe.com/de/pricing/',
    },
    createdAt: '2019-03-19T15:00:00.000+0000',
    updatedAt: '2019-03-19T15:00:00.000+0000',
  },

  // swedbank_creditcard
  {
    _id: '8c2490ab-24d0-4565-a998-c97ab3a6dc2d',
    name: 'swedbank_creditcard',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/swedbank_creditcard/action/{action}',
        initEndpoint: '/business/{businessId}/integration/swedbank_creditcard/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'bb166371-93cc-4a42-9bfb-4452c8bd6cfb',
      icon: '#icon-payment-option-swedbank',
      title: 'integrations.payments.swedbank_creditcard.title',
      bgColor: '#FE512C-#FEA150',
    },
    enabled: true,
    installationOptions: {
      _id: '785d7faf-1ccb-4259-94e5-05e5693b3207',
      countryList: [
        'SE',
        'DK',
        'NO',
        'FI'
      ],
      links: [
        {
          _id: 'b1e1905c-fc30-49f5-85a6-af3615f7efeb',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/swedbank-creditcard.png`,
        },
      ],
      optionIcon: '#icon-payment-option-swedbank',
      appSupport: 'integrations.payments.swedbank_creditcard.support_link',
      category: 'integrations.payments.swedbank_creditcard.category',
      description: 'integrations.payments.swedbank_creditcard.description',
      developer: 'integrations.payments.swedbank_creditcard.developer',
      languages: 'integrations.payments.swedbank_creditcard.languages',
      price: 'integrations.payments.swedbank_creditcard.price',
      pricingLink: 'integrations.payments.swedbank_creditcard.pricing_link',
      website: 'integrations.payments.swedbank_creditcard.website_link',
    },
    createdAt: '2020-06-23T11:17:00.000+0000',
    updatedAt: '2020-06-23T11:17:00.000+0000',
  },

  // swedbank_invoice
  {
    _id: 'e70792a0-f24e-47f2-a287-97c772c14497',
    name: 'swedbank_invoice',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/swedbank_invoice/action/{action}',
        initEndpoint: '/business/{businessId}/integration/swedbank_invoice/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '53247dab-f481-4843-9b0c-bf4e5bfab999',
      icon: '#icon-payment-option-swedbank',
      title: 'integrations.payments.swedbank_invoice.title',
      bgColor: '#FE512C-#FEA150',
    },
    enabled: true,
    installationOptions: {
      _id: '58702bdc-b16e-4f65-85c3-c380f9ce5623',
      countryList: [
        'SE',
        'NO'
      ],
      links: [
        {
          _id: '8bc09a45-4605-4878-bfe2-cbbd40a6b138',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/swedbank-invoice.png`,
        },
      ],
      optionIcon: '#icon-payment-option-swedbank',
      appSupport: 'integrations.payments.swedbank_invoice.support_link',
      category: 'integrations.payments.swedbank_invoice.category',
      description: 'integrations.payments.swedbank_invoice.description',
      developer: 'integrations.payments.swedbank_invoice.developer',
      languages: 'integrations.payments.swedbank_invoice.languages',
      price: 'integrations.payments.swedbank_invoice.price',
      pricingLink: 'integrations.payments.swedbank_invoice.pricing_link',
      website: 'integrations.payments.swedbank_invoice.website_link',
    },
    createdAt: '2020-06-23T11:17:00.000+0000',
    updatedAt: '2020-06-23T11:17:00.000+0000',
  },

  // zinia_bnpl
  {
    _id: '2460202d-bb6e-4877-a3f2-8a4b472d6f0a',
    name: 'zinia_bnpl',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_bnpl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_bnpl/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '3d4d439c-7269-4b42-b119-2c27f2e05130',
      icon: '#payment-method-openbank',
      title: 'integrations.payments.openbank.title',
    },
    enabled: true,
    installationOptions: {
      _id: '68afb9cd-0f18-4431-bf8f-cb44b76c3d6e',
      countryList: [],
      links: [
        {
          _id: 'fa73ef1c-37e4-4cc7-88a6-bc066812747e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-netherlands.png`,
        },
      ],
      optionIcon: '#icon-payment-option-openbank',

      appSupport: 'integrations.payments.openbank.support_link',
      category: 'integrations.payments.openbank.category',
      description: 'integrations.payments.openbank.description',
      developer: 'integrations.payments.openbank.developer',
      languages: 'integrations.payments.openbank.languages',
      price: 'integrations.payments.openbank.price',
      pricingLink: 'integrations.payments.openbank.pricing_link',
      website: 'integrations.payments.openbank.website_link',
    },
    createdAt: '2021-08-24T10:28:00.000+0000',
    updatedAt: '2021-08-24T10:28:00.000+0000',
  },

  // zinia_bnpl_de
  {
    _id: '55b5851b-4cc7-4d28-922a-f653ddce71bb',
    name: 'zinia_bnpl_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_bnpl_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_bnpl_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '7f50379c-f047-46b2-a1c6-c3fe0930eb96',
      icon: '#payment-method-zinia_bnpl_de',
      title: 'integrations.payments.zinia_bnpl_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: '29a52dde-b9ba-45c7-b08d-ee80a7b63f5b',
      countryList: [],
      links: [
        {
          _id: '8c55b314-86b9-4f81-877b-2d0853597029',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_bnpl_de',

      appSupport: 'integrations.payments.zinia_bnpl_de.support_link',
      category: 'integrations.payments.zinia_bnpl_de.category',
      description: 'integrations.payments.zinia_bnpl_de.description',
      developer: 'integrations.payments.zinia_bnpl_de.developer',
      languages: 'integrations.payments.zinia_bnpl_de.languages',
      price: 'integrations.payments.zinia_bnpl_de.price',
      pricingLink: 'integrations.payments.zinia_bnpl_de.pricing_link',
      website: 'integrations.payments.zinia_bnpl_de.website_link',
    },
    createdAt: '2022-05-02T15:00:00.000+0000',
    updatedAt: '2022-05-02T15:00:00.000+0000',
  },

  // zinia_installment
  {
    _id: '99c5ea07-daeb-4997-ab68-a91e145f5b7f',
    name: 'zinia_installment',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_installment/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_installment/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '81abb954-aa3f-432b-b3a9-eeaed203e66f',
      icon: '#payment-method-zinia_installment',
      title: 'integrations.payments.zinia_installment.title',
    },
    enabled: true,
    installationOptions: {
      _id: '106696a8-a3f9-4717-9e89-7fb77615220d',
      countryList: [],
      links: [
        {
          _id: '06884cac-941b-4a2f-b936-fa54c332ba2b',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-netherlands.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_installment',

      appSupport: 'integrations.payments.zinia_installment.support_link',
      category: 'integrations.payments.zinia_installment.category',
      description: 'integrations.payments.zinia_installment.description',
      developer: 'integrations.payments.zinia_installment.developer',
      languages: 'integrations.payments.zinia_installment.languages',
      price: 'integrations.payments.zinia_installment.price',
      pricingLink: 'integrations.payments.zinia_installment.pricing_link',
      website: 'integrations.payments.zinia_installment.website_link',
    },
    createdAt: '2022-04-05T09:23:00.000+0000',
    updatedAt: '2022-04-05T09:23:00.000+0000',
  },

  // zinia_installment_de
  {
    _id: '6f382d87-d599-4e1f-bdde-d72733be9134',
    name: 'zinia_installment_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_installment_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_installment_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '05d6532f-b5bc-4f35-bf69-f8ef9e3180a9',
      icon: '#payment-method-zinia_installment_de',
      title: 'integrations.payments.zinia_installment_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: '1067313c-bdb5-42b5-ac9c-d0d38bd65fbf',
      countryList: [],
      links: [
        {
          _id: 'd72f9f6e-2f5b-40f5-b57c-df0926d4ed67',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_installment_de',

      appSupport: 'integrations.payments.zinia_installment_de.support_link',
      category: 'integrations.payments.zinia_installment_de.category',
      description: 'integrations.payments.zinia_installment_de.description',
      developer: 'integrations.payments.zinia_installment_de.developer',
      languages: 'integrations.payments.zinia_installment_de.languages',
      price: 'integrations.payments.zinia_installment_de.price',
      pricingLink: 'integrations.payments.zinia_installment_de.pricing_link',
      website: 'integrations.payments.zinia_installment_de.website_link',
    },
    createdAt: '2022-05-02T15:00:00.000+0000',
    updatedAt: '2022-05-02T15:00:00.000+0000',
  },

  // zinia_pos_installment
  {
    _id: '1b8480db-5cf3-4b83-9757-648951144cb5',
    name: 'zinia_pos_installment',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos_installment/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos_installment/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '81abb954-aa3f-432b-b3a9-eeaed203e66f',
      icon: '#payment-method-zinia_pos_installment',
      title: 'integrations.payments.zinia_pos_installment.title',
    },
    enabled: true,
    installationOptions: {
      _id: '106696a8-a3f9-4717-9e89-7fb77615220d',
      countryList: [],
      links: [
        {
          _id: '06884cac-941b-4a2f-b936-fa54c332ba2b',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-netherlands-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_pos_installment',

      appSupport: 'integrations.payments.zinia_pos_installment.support_link',
      category: 'integrations.payments.zinia_pos_installment.category',
      description: 'integrations.payments.zinia_pos_installment.description',
      developer: 'integrations.payments.zinia_pos_installment.developer',
      languages: 'integrations.payments.zinia_pos_installment.languages',
      price: 'integrations.payments.zinia_pos_installment.price',
      pricingLink: 'integrations.payments.zinia_pos_installment.pricing_link',
      website: 'integrations.payments.zinia_pos_installment.website_link',
    },
    createdAt: '2023-06-15T09:23:00.000+0000',
    updatedAt: '2023-06-15T09:23:00.000+0000',
  },

  // zinia_pos_installment_de
  {
    _id: '55bc4361-a878-4f9d-b2da-3b667c5c14b6 ',
    name: 'zinia_pos_installment_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos_installment_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos_installment_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '05d6532f-b5bc-4f35-bf69-f8ef9e3180a9',
      icon: '#payment-method-zinia_pos_installment_de',
      title: 'integrations.payments.zinia_pos_installment_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: '1067313c-bdb5-42b5-ac9c-d0d38bd65fbf',
      countryList: [],
      links: [
        {
          _id: 'd72f9f6e-2f5b-40f5-b57c-df0926d4ed67',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-germany-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_pos_installment_de',

      appSupport: 'integrations.payments.zinia_pos_installment_de.support_link',
      category: 'integrations.payments.zinia_pos_installment_de.category',
      description: 'integrations.payments.zinia_pos_installment_de.description',
      developer: 'integrations.payments.zinia_pos_installment_de.developer',
      languages: 'integrations.payments.zinia_pos_installment_de.languages',
      price: 'integrations.payments.zinia_pos_installment_de.price',
      pricingLink: 'integrations.payments.zinia_pos_installment_de.pricing_link',
      website: 'integrations.payments.zinia_pos_installment_de.website_link',
    },
    createdAt: '2023-06-15T15:00:00.000+0000',
    updatedAt: '2023-06-15T15:00:00.000+0000',
  },

  // zinia_pos
  {
    _id: '5e98b37a-237b-4524-892a-d4d9d927681b',
    name: 'zinia_pos',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '81abb954-aa3f-432b-b3a9-eeaed203e66f',
      icon: '#payment-method-openbank_pos',
      title: 'integrations.payments.openbank_pos.title',
    },
    enabled: true,
    installationOptions: {
      _id: '88e05a72-f339-4037-a6ba-c421b6968082',
      countryList: [],
      links: [
        {
          _id: '5c712f45-96f0-4170-9cd9-e083fb730ed5',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-netherlands-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-openbank_pos',

      appSupport: 'integrations.payments.openbank_pos.support_link',
      category: 'integrations.payments.openbank_pos.category',
      description: 'integrations.payments.openbank_pos.description',
      developer: 'integrations.payments.openbank_pos.developer',
      languages: 'integrations.payments.openbank_pos.languages',
      price: 'integrations.payments.openbank_pos.price',
      pricingLink: 'integrations.payments.openbank_pos.pricing_link',
      website: 'integrations.payments.openbank_pos.website_link',
    },
    createdAt: '2022-03-28T13:41:00.000+0000',
    updatedAt: '2022-03-28T13:41:00.000+0000',
  },

  // zinia_pos_de
  {
    _id: 'c1fc4cc0-7ee7-41f5-abb6-a0f0eef6aed6',
    name: 'zinia_pos_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '695eff27-6944-4b50-8893-60ade313e278',
      icon: '#payment-method-zinia_pos_de',
      title: 'integrations.payments.zinia_pos_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: 'c3eaf7a4-d561-47fc-b5cd-d58237725421',
      countryList: [],
      links: [
        {
          _id: '40937ccd-85f9-45c9-9060-962b4e17cd06',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-germany-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_pos_de',

      appSupport: 'integrations.payments.zinia_pos_de.support_link',
      category: 'integrations.payments.zinia_pos_de.category',
      description: 'integrations.payments.zinia_pos_de.description',
      developer: 'integrations.payments.zinia_pos_de.developer',
      languages: 'integrations.payments.zinia_pos_de.languages',
      price: 'integrations.payments.zinia_pos_de.price',
      pricingLink: 'integrations.payments.zinia_pos_de.pricing_link',
      website: 'integrations.payments.zinia_pos_de.website_link',
    },
    createdAt: '2022-05-02T15:00:00.000+0000',
    updatedAt: '2022-05-02T15:00:00.000+0000',
  },

  // zinia_slice_three
  {
    _id: 'e3b3c3cd-ba33-4dee-9427-c029eb0c2063',
    name: 'zinia_slice_three',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_slice_three/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_slice_three/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'fbedd0bb-b7fa-46c6-9c00-76e4eb57acb5',
      icon: '#payment-method-zinia_slice_three',
      title: 'integrations.payments.zinia_slice_three.title',
    },
    enabled: true,
    installationOptions: {
      _id: '1e9df6a7-3e87-47cf-8b44-8c7f9d7f85ab',
      countryList: [],
      links: [
        {
          _id: 'aea54ee4-01d0-4811-92e2-bffef04e4cf2',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-netherlands.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_slice_three',

      appSupport: 'integrations.payments.zinia_slice_three.support_link',
      category: 'integrations.payments.zinia_slice_three.category',
      description: 'integrations.payments.zinia_slice_three.description',
      developer: 'integrations.payments.zinia_slice_three.developer',
      languages: 'integrations.payments.zinia_slice_three.languages',
      price: 'integrations.payments.zinia_slice_three.price',
      pricingLink: 'integrations.payments.zinia_slice_three.pricing_link',
      website: 'integrations.payments.zinia_slice_three.website_link',
    },
    createdAt: '2022-04-05T09:23:00.000+0000',
    updatedAt: '2022-04-05T09:23:00.000+0000',
  },

  // zinia_slice_three_de
  {
    _id: '29a2ddb3-0608-42e8-9168-a381dadddf8b',
    name: 'zinia_slice_three_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_slice_three_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_slice_three_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '695eff27-6944-4b50-8893-60ade313e278',
      icon: '#payment-method-zinia_slice_three_de',
      title: 'integrations.payments.zinia_slice_three_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: '8b807122-38a5-45ad-8cc4-b8ecb15ab1b2',
      countryList: [],
      links: [
        {
          _id: 'dc7e7512-f878-4f33-b2a6-749108ae8da6',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-germany.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_slice_three_de',

      appSupport: 'integrations.payments.zinia_slice_three_de.support_link',
      category: 'integrations.payments.zinia_slice_three_de.category',
      description: 'integrations.payments.zinia_slice_three_de.description',
      developer: 'integrations.payments.zinia_slice_three_de.developer',
      languages: 'integrations.payments.zinia_slice_three_de.languages',
      price: 'integrations.payments.zinia_slice_three_de.price',
      pricingLink: 'integrations.payments.zinia_slice_three_de.pricing_link',
      website: 'integrations.payments.zinia_slice_three_de.website_link',
    },
    createdAt: '2022-05-02T15:00:00.000+0000',
    updatedAt: '2022-05-02T15:00:00.000+0000',
  },

  // zinia_pos_slice_three
  {
    _id: 'ea801c1b-d197-42d5-b8a8-4c322bbcf095',
    name: 'zinia_pos_slice_three',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos_slice_three/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos_slice_three/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'fbedd0bb-b7fa-46c6-9c00-76e4eb57acb5',
      icon: '#payment-method-zinia_pos_slice_three',
      title: 'integrations.payments.zinia_pos_slice_three.title',
    },
    enabled: true,
    installationOptions: {
      _id: '1e9df6a7-3e87-47cf-8b44-8c7f9d7f85ab',
      countryList: [],
      links: [
        {
          _id: 'aea54ee4-01d0-4811-92e2-bffef04e4cf2',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-netherlands-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_pos_slice_three',

      appSupport: 'integrations.payments.zinia_pos_slice_three.support_link',
      category: 'integrations.payments.zinia_pos_slice_three.category',
      description: 'integrations.payments.zinia_pos_slice_three.description',
      developer: 'integrations.payments.zinia_pos_slice_three.developer',
      languages: 'integrations.payments.zinia_pos_slice_three.languages',
      price: 'integrations.payments.zinia_pos_slice_three.price',
      pricingLink: 'integrations.payments.zinia_pos_slice_three.pricing_link',
      website: 'integrations.payments.zinia_pos_slice_three.website_link',
    },
    createdAt: '2023-06-15T09:23:00.000+0000',
    updatedAt: '2023-06-15T09:23:00.000+0000',
  },

  // zinia_pos_slice_three_de
  {
    _id: 'd06f740b-8d2f-43a7-a65d-8d643b3c1d4d',
    name: 'zinia_pos_slice_three_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos_slice_three_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos_slice_three_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '695eff27-6944-4b50-8893-60ade313e278',
      icon: '#payment-method-zinia_pos_slice_three_de',
      title: 'integrations.payments.zinia_pos_slice_three_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: '8b807122-38a5-45ad-8cc4-b8ecb15ab1b2',
      countryList: [],
      links: [
        {
          _id: 'dc7e7512-f878-4f33-b2a6-749108ae8da6',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-germany-pos.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_pos_slice_three_de',

      appSupport: 'integrations.payments.zinia_pos_slice_three_de.support_link',
      category: 'integrations.payments.zinia_pos_slice_three_de.category',
      description: 'integrations.payments.zinia_pos_slice_three_de.description',
      developer: 'integrations.payments.zinia_pos_slice_three_de.developer',
      languages: 'integrations.payments.zinia_pos_slice_three_de.languages',
      price: 'integrations.payments.zinia_pos_slice_three_de.price',
      pricingLink: 'integrations.payments.zinia_pos_slice_three_de.pricing_link',
      website: 'integrations.payments.zinia_pos_slice_three_de.website_link',
    },
    createdAt: '2023-06-15T15:00:00.000+0000',
    updatedAt: '2023-06-15T15:00:00.000+0000',
  },

  /* PRODUCTS */

  // amazon
  {
    _id: 'ed33ebdd-1fc1-4686-b9ef-fca7eb401c88',
    name: 'amazon',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/amazon/action/{action}',
        initEndpoint: '/business/{businessId}/integration/amazon/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: 'af3ecdc5-e194-4a7d-89dc-4f2289b91c5a',
      icon: '#payment-method-amazon',
      title: 'Amazon',
      bgColor: '#39B0F0-#3CB9FF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '81612f6c-0aec-4f51-9d13-eb82eeaed18e',
      links: [
        {
          _id: 'd2bcdc10-825f-415c-8d46-ed2b53639d45',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/amazon.png`,
        },
      ],
      optionIcon: '#payment-method-amazon',
      price: 'integrations.products.amazon.price',
      category: 'integrations.products.amazon.category',
      developer: 'integrations.products.amazon.developer',
      languages: 'integrations.products.amazon.languages',
      description: 'integrations.products.amazon.description',
      appSupport: 'integrations.products.amazon.support_link',
      website: 'integrations.products.amazon.website_link',
      pricingLink: 'integrations.products.amazon.pricing_link',
    },
    createdAt: '2019-03-05T18:00:00.000+0000',
    updatedAt: '2019-03-05T19:00:00.000+0000',
  },

  // ebay
  {
    _id: '6fc2e9be-bc7e-4c14-9f88-d4f9ffce9ba5',
    name: 'ebay',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/ebay/action/{action}',
        initEndpoint: '/business/{businessId}/integration/ebay/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: '84a7e4aa-8a23-4778-a8c7-28b7c908ba37',
      icon: '#icon-products-ebay',
      title: 'eBay',
      bgColor: '#373737-#959595',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'a55e3e0a-edd7-4fe3-86ea-cbf630acb79c',
      links: [
        {
          _id: '3738f3f6-95e2-48f3-af86-46380376261c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/ebay.png`,
        },
      ],
      optionIcon: '#icon-products-ebay',
      price: 'integrations.products.ebay.price',
      category: 'integrations.products.ebay.category',
      developer: 'integrations.products.ebay.developer',
      languages: 'integrations.products.ebay.languages',
      description: 'integrations.products.ebay.description',
      appSupport: 'integrations.products.ebay.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.ebay.com/sh/landing',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // external-inventory
  {
    _id: '344fd290-9c91-11e9-8dbe-dbeae92485e6',
    name: 'external-inventory',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/external-inventory/action/{action}',
        initEndpoint: '/business/{businessId}/integration/external-inventory/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: '84a7e4aa-8a23-4778-a8c7-28b7c908ba37',
      icon: '#icon-api',
      title: 'integrations.products.external-inventory.title',
      bgColor: '#8767FF-#A280F7',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'a55e3e0a-edd7-4fe3-86ea-cbf630acb79c',
      links: [
        {
          _id: 'e0a0090c-9cdc-11e9-9322-af771d12dfa7',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/api.png`,
        },
      ],
      optionIcon: '#icon-api',
      price: 'integrations.products.external-inventory.price',
      category: 'integrations.products.external-inventory.category',
      developer: 'integrations.products.external-inventory.developer',
      languages: 'integrations.products.external-inventory.languages',
      description: 'integrations.products.external-inventory.description',
      appSupport: 'integrations.products.external-inventory.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://getpayever.com/developer/api-documentation/',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // google_shopping
  {
    _id: '68b8c75c-fd3f-4450-b44b-b1d0057110d6',
    name: 'google_shopping',
    category: 'products',
    displayOptions: {
      _id: 'db15a3b1-3c2c-4ed2-9465-f2ed23371997',
      icon: '#icon-products-google-shopping',
      title: 'Google Shopping',
      bgColor: '#373737-#959595',
    },
    enabled: true,
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/google_shopping/action/{action}',
        initEndpoint: '/business/{businessId}/integration/google_shopping/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    installationOptions: {
      countryList: [],
      _id: '5accee34-7d9b-4184-9358-0f5498760b1d',
      links: [
        {
          _id: 'c8ac17da-d5c3-4c38-8595-b9e7827b8d2f',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/google-shopping.png`,
        },
      ],
      optionIcon: '#icon-products-google-shopping',
      price: 'integrations.products.google_shopping.price',
      category: 'integrations.products.google_shopping.category',
      developer: 'integrations.products.google_shopping.developer',
      languages: 'integrations.products.google_shopping.languages',
      description: 'integrations.products.google_shopping.description',
      appSupport: 'integrations.products.google_shopping.support_link',
      website: 'integrations.products.google_shopping.website_link',
      pricingLink: 'integrations.products.google_shopping.pricing_link',
    },
    createdAt: '2019-02-20T18:00:00.000+0000',
    updatedAt: '2019-02-20T19:00:00.000+0000',
  },

  // facebook
  {
    _id: '1246e4a6-9845-4dd9-b4d0-17133f2e03ab',
    name: 'facebook',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/facebook/action/{action}',
        initEndpoint: '/business/{businessId}/integration/facebook/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-facebook',
      title: 'integrations.products.facebook.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/facebook.png`,
        },
      ],
      optionIcon: '#icon-products-facebook',
      price: 'integrations.products.facebook.price',
      category: 'integrations.products.facebook.category',
      developer: 'integrations.products.facebook.developer',
      languages: 'integrations.products.facebook.languages',
      description: 'integrations.products.facebook.description',
      appSupport: 'integrations.products.facebook.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.facebook.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // idealo
  {
    _id: '57a6078b-8541-4999-8669-0222cf98a857',
    name: 'idealo',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/idealo/action/{action}',
        initEndpoint: '/business/{businessId}/integration/idealo/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: 'd688fd97-8167-48f4-b72a-c5e68cbc0630',
      icon: '#icon-products-idealo',
      title: 'Idealo',
      bgColor: '#373737-#959595',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: 'e4878bf2-4fc7-4c93-bd88-d7d6412340bb',
      links: [
        {
          _id: '4aaf6fc1-8336-4ad5-b34a-9d42960cb608',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/idealo.png`,
        },
      ],
      optionIcon: '#icon-products-idealo',
      price: 'integrations.products.idealo.price',
      category: 'integrations.products.idealo.category',
      developer: 'integrations.products.idealo.developer',
      languages: 'integrations.products.idealo.languages',
      description: 'integrations.products.idealo.description',
      appSupport: 'integrations.products.idealo.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://partner.idealo.com/de',
    },
    createdAt: '2022-06-13T00:00:00.000+0000',
    updatedAt: '2022-06-13T00:00:00.000+0000',
  },

  // instagram
  {
    _id: '1246e4a6-9845-4dd9-b4d0-17133f2e03ac',
    name: 'instagram',
    category: 'products',
    enabled: true,
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/instagram/action/{action}',
        initEndpoint: '/business/{businessId}/integration/instagram/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-apps-instagram-28',
      title: 'integrations.products.instagram.title',
    },
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/instagram.png`,
        },
      ],
      optionIcon: '#icon-products-instagram',
      price: 'integrations.products.instagram.price',
      category: 'integrations.products.instagram.category',
      developer: 'integrations.products.instagram.developer',
      languages: 'integrations.products.instagram.languages',
      description: 'integrations.products.instagram.description',
      appSupport: 'integrations.products.instagram.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.instagram.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // mobilede
  {
    _id: '492ed18b-c441-4501-9c37-dc3b0321d6f4',
    name: 'mobilede',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/mobilede/action/{action}',
        initEndpoint: '/business/{businessId}/integration/mobilede/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: '53974b1f-3781-4d6d-b66b-d234a1810416',
      icon: '#icon-products-mobilede',
      title: 'Mobile.de',
      bgColor: '#EA1E27-#A71E27',
    },
    enabled: false,
    installationOptions: {
      _id: '73ee7317-7b84-4273-9d4c-efd44372b665',
      appSupport: 'integrations.products.mobilede.support_link',
      category: 'integrations.products.mobilede.category',
      countryList: [],
      description: 'integrations.products.mobilede.description',
      developer: 'integrations.products.mobilede.developer',
      languages: 'integrations.products.mobilede.languages',
      links: [
        {
          _id: '53d6f7f7-5644-49bf-ab4b-a0fc6a412305',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/mobilede.png`,
        },
      ],
      optionIcon: '#icon-mobilede',
      price: 'integrations.products.mobilede.price',
      pricingLink: 'integrations.products.mobilede.pricing_link',
      website: 'integrations.products.mobilede.website_link',
    },
    createdAt: '2020-02-11T10:00:00.000+0000',
    updatedAt: '2020-02-11T10:00:00.000+0000',
  },

  // otto
  {
    _id: '003f939d-ec35-4a9a-8d8e-399ef9707744',
    name: 'otto',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/otto/action/{action}',
        initEndpoint: '/business/{businessId}/integration/otto/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: 'd3027158-8599-4ef3-9f64-044fcf5aeccd',
      icon: '#icon-products-otto',
      title: 'OTTO',
      bgColor: '#373737-#959595',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: '835eefcc-629e-4843-9e28-1b9ae16ce0c8',
      links: [
        {
          _id: '36ba9d67-faee-4f53-b5c9-60c0368ea655',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/otto.png`,
        },
      ],
      optionIcon: '#icon-products-otto',
      price: 'integrations.products.otto.price',
      category: 'integrations.products.otto.category',
      developer: 'integrations.products.otto.developer',
      languages: 'integrations.products.otto.languages',
      description: 'integrations.products.otto.description',
      appSupport: 'integrations.products.otto.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://partner.otto.com/de',
    },
    createdAt: '2022-06-13T00:00:00.000+0000',
    updatedAt: '2022-06-13T00:00:00.000+0000',
  },

  // shopify-product
  {
    _id: '284f8af5-8526-49ef-a4c3-53ce8f62639c',
    name: 'shopify-product',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/shopify-product/action/{action}',
        initEndpoint: '/business/{businessId}/integration/shopify-product/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: '98691cf0-623d-4987-8508-736242ba43ce',
      icon: '#icon-shopify',
      title: 'Shopify Product',
      bgColor: '#698D48-#36A645',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: 'af041e4b-4c6f-4e3d-81d5-a029285e733a',
      links: [
        {
          _id: '6ce8cdcb-cf4b-4fc0-88ea-5cc33131634e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/shopify.png`,
        },
      ],
      optionIcon: '#icon-shopify',
      price: 'integrations.shopsystems.shopify.price',
      category: 'integrations.shopsystems.shopify.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.shopify.description',
      appSupport: 'https://getpayever.com/shopsystem/shopify/',
      website: 'https://getpayever.com/shopsystem/shopify/',
      pricingLink: 'https://www.shopify.com/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  {
    _id: 'bcc98a48-5e0b-4bb4-a81c-a6660fb4d12c',
    name: 'zalando',
    category: 'products',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/zalando/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zalando/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PRODUCTS}/api',
    },
    displayOptions: {
      _id: 'dd5ec345-d725-4ea7-ac45-2b683c8dc8ad',
      icon: '#icon-products-zalando',
      title: 'Zalando',
      bgColor: '#373737-#959595',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: '6009c435-5145-4e68-a858-5333c69df482',
      links: [
        {
          _id: '2e48620a-4e5c-44a8-8bcd-84b043f9b53e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/products/zalando.png`,
        },
      ],
      optionIcon: '#icon-products-zalando',
      price: 'integrations.products.zalando.price',
      category: 'integrations.products.zalando.category',
      developer: 'integrations.products.zalando.developer',
      languages: 'integrations.products.zalando.languages',
      description: 'integrations.products.zalando.description',
      appSupport: 'integrations.products.zalando.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://partnerportal.zalando.com/',
    },
    createdAt: '2022-06-28T00:00:00.000+0000',
    updatedAt: '2022-06-28T00:00:00.000+0000',
  },


  /* SHIPPINGS */

  // dhl
  {
    _id: '46dff89b-6190-4e55-bdc4-fa1888bda518',
    name: 'dhl',
    category: 'shippings',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/dhl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/dhl/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SHIPPING}/api',
    },
    displayOptions: {
      _id: 'fb72e27f-1e88-49d1-b5ee-c3d32a42e0f7',
      icon: '#icon-shipping-dhl-32',
      title: 'DHL',
      bgColor: '#FFCF02-#FECD00',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '3b40640b-8ed9-4f0b-b6d5-dbcea1e715a0',
      links: [
        {
          _id: '9eee8e92-7c11-4349-925a-ec0a31666d38',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shipping/dhl.png`,
        },
      ],
      optionIcon: '#icon-shipping-dhl-42-colored',
      price: 'integrations.shippings.dhl.price',
      category: 'integrations.shippings.dhl.category',
      developer: 'integrations.shippings.dhl.developer',
      languages: 'integrations.shippings.dhl.languages',
      description: 'integrations.shippings.dhl.description',
      appSupport: 'integrations.shippings.dhl.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.dhl.de/de/geschaeftskunden.html',
    },
    createdAt: '2018-12-13T16:13:41.339+0000',
    updatedAt: '2018-12-13T16:13:41.339+0000',
  },

  // hermes
  {
    _id: '6d557fc7-9d86-4b38-963f-d432d6e288b8',
    name: 'hermes',
    category: 'shippings',
    displayOptions: {
      _id: '19e8013b-3901-421a-98d7-b3758bd2df7f',
      icon: '#icon-shipping-hermes-white',
      title: 'Hermes',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '29e7ba15-cc7d-4837-8a28-69ab430819e3',
      links: [
        {
          _id: 'a7241ed4-40ef-4f70-9ba3-9e1915a16b78',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shipping/hermes.png`,
        },
      ],
      optionIcon: '#icon-shipping-hermes-white',
      price: 'integrations.shippings.hermes.price',
      category: 'integrations.shippings.hermes.description',
      developer: 'integrations.shippings.hermes.developer',
      languages: 'integrations.shippings.hermes.languages',
      description: 'integrations.shippings.hermes.description',
      appSupport: 'integrations.shippings.hermes.appSupport_link',
      website: 'integrations.shippings.hermes.website_link',
      pricingLink: 'integrations.shippings.hermes.pricing_link',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },

  // ups
  {
    _id: '07056a9a-e75f-49da-89ad-ba0e02680935',
    name: 'ups',
    category: 'shippings',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/ups/action/{action}',
        initEndpoint: '/business/{businessId}/integration/ups/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SHIPPING}/api',
    },
    displayOptions: {
      _id: 'a88c631b-7819-4d00-bbeb-744b99dd7eed',
      icon: '#icon-shipping-ups-white',
      title: 'Ups',
      bgColor: '#3a1f17',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '9342dbd4-5fe2-4a69-94bb-782f00e0ef12',
      links: [
        {
          _id: 'ecfb1eed-feb1-49e3-b440-60f0412ca194',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shipping/ups.png`,
        },
      ],
      optionIcon: '#icon-shipping-ups-white',
      price: 'integrations.shippings.ups.price',
      category: 'integrations.shippings.ups.description',
      developer: 'integrations.shippings.ups.developer',
      languages: 'integrations.shippings.ups.languages',
      description: 'integrations.shippings.ups.description',
      appSupport: 'integrations.shippings.ups.appSupport_link',
      website: 'integrations.shippings.ups.website_link',
      pricingLink: 'integrations.shippings.ups.pricing_link',
    },
    createdAt: '2018-11-12T18:13:41.339+0000',
    updatedAt: '2018-11-12T18:13:41.339+0000',
  },


  /* SHOP SYSTEMS */

  // api
  {
    _id: '378f1080-aff6-4199-a287-20da11afbfe8',
    name: 'api',
    category: 'shopsystems',
    displayOptions: {
      _id: 'd32ea486-b8e8-41e8-849c-40202988c801',
      icon: '#icon-api',
      title: 'integrations.shopsystems.api.title',
      bgColor: '#373737-#959595',
    },
    enabled: true,
    installationOptions: {
      links: [
        {
          _id: 'b5594097-b699-40e2-ae32-cb0409d0694f',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/api.png`,
        },
      ],
      optionIcon: '#icon-api',
      price: 'integrations.shopsystems.api.price',
      category: 'integrations.shopsystems.api.category',
      developer: 'integrations.shopsystems.api.developer',
      languages: 'integrations.shopsystems.api.languages',
      description: 'integrations.shopsystems.api.description',
      appSupport: 'integrations.shopsystems.api.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://getpayever.com/developer/api-documentation/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // commercetools
  {
    _id: 'e0916738-8d77-4786-ba1b-f2836f738f40',
    name: 'commercetools',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/commercetools/action/{action}',
        initEndpoint: '/business/{businessId}/integration/commercetools/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: 'cb794d1e-2f12-42e4-be09-d9341a74ee72',
      icon: '#icon-apps-commercetools',
      title: 'integrations.shopsystems.commercetools.tools',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      _id: '1ae60653-a901-4a9c-aac0-292ea8c1ed99',
      links: [
        {
          _id: 'f0d5090f-5515-4686-9682-a8c19639ced8',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/commercetools.png`,
        },
      ],
      optionIcon: '#icon-commercetools',
      appSupport: 'integrations.shopsystems.commercetools.support_link',
      category: 'integrations.shopsystems.commercetools.category',
      description: 'integrations.shopsystems.commercetools.description',
      developer: 'integrations.shopsystems.commercetools.developer',
      languages: 'integrations.shopsystems.commercetools.languages',
      price: 'integrations.shopsystems.commercetools.price',
      pricingLink: 'integrations.shopsystems.commercetools.pricing_link',
      website: 'integrations.shopsystems.commercetools.website_link',
    },
    createdAt: '2021-03-25T09:00:00.000+0000',
    updatedAt: '2021-03-25T09:00:00.000+0000',
  },

  // ccvshop
  {
    _id: '5b81fb49-db77-41a0-8109-fd1d8504e61f',
    name: 'ccvshop',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/ccvshop/action/{action}',
        initEndpoint: '/business/{businessId}/integration/ccvshop/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '738eb46b-c7d3-49f4-8d06-54b755737aab',
      icon: '#icon-apps-ccvshop',
      title: 'integrations.shopsystems.ccvshop.title',
      bgColor: '#828B93-#AFBCC7',
    },
    enabled: true,
    installationOptions: {
      _id: '827bd9da-9ac1-4f3e-862b-dc5d5c2da742',
      links: [
        {
          _id: 'ea057bec-643e-4559-bbc1-42b8bf072b42',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/ccvshop.png`,
        },
      ],
      optionIcon: '#icon-ccvshop',
      appSupport: 'integrations.shopsystems.ccvshop.support_link',
      category: 'integrations.shopsystems.ccvshop.category',
      description: 'integrations.shopsystems.ccvshop.description',
      developer: 'integrations.shopsystems.ccvshop.developer',
      languages: 'integrations.shopsystems.ccvshop.languages',
      price: 'integrations.shopsystems.ccvshop.price',
      pricingLink: 'integrations.shopsystems.ccvshop.pricing_link',
      website: 'integrations.shopsystems.ccvshop.website_link',
    },
    createdAt: '2022-07-15T09:00:00.000+0000',
    updatedAt: '2022-07-15T09:00:00.000+0000',
  },

  // dandomain
  {
    _id: '150c5fef-673f-4b7f-8027-3138d9e25377',
    name: 'dandomain',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/dandomain/action/{action}',
        initEndpoint: '/business/{businessId}/integration/dandomain/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: 'b59ca69a-aa7e-429e-ba6a-bd4e2181dcdd',
      icon: '#icon-dan-domain-bw',
      title: 'DanDomain',
      bgColor: '#97CADA-#A4DBEA',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DK'
      ],
      _id: 'f4dc3f0f-4949-4ee6-af63-6603c5c47d72',
      links: [
        {
          _id: '1beb886c-3867-4536-999f-5988e8615c43',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/dandomain.png`,
        },
      ],
      optionIcon: '#icon-dan-domain-bw',
      price: 'integrations.shopsystems.dandomain.price',
      category: 'integrations.shopsystems.dandomain.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.dandomain.description',
      appSupport: 'https://getpayever.com/shopsystem/dandomain/',
      website: 'https://getpayever.com/shopsystem/dandomain/',
      pricingLink: 'https://dandomain.dk/webshop/overblik',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // jtl
  {
    _id: '1459d089-0c9a-4c81-bab8-919fd66425bf',
    name: 'jtl',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/jtl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/jtl/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '9e7c2c58-f38e-4bc9-b46a-516fcc44fa38',
      icon: '#icon-jtl',
      title: 'JTL',
      bgColor: '#000000-#373737',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '78e7b2e8-251d-4ab7-87c1-576334a7e832',
      links: [
        {
          _id: 'c2d2031c-a707-40bc-a755-9b8abd776231',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/jtl.png`,
        },
      ],
      optionIcon: '#icon-jtl',
      price: 'integrations.shopsystems.jtl.price',
      category: 'integrations.shopsystems.jtl.category',
      developer: 'PayPal Inc.',
      languages: 'German, English',
      description: 'integrations.shopsystems.jtl.description',
      appSupport: 'https://getpayever.com/shopsystem/jtl/',
      website: 'https://getpayever.com/shopsystem/jtl/',
      pricingLink: 'https://www.jtl-software.de/online-shopsystem',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // magento
  {
    _id: 'ecd144b2-6443-4cbb-a5b1-4b8b5f4d3131',
    name: 'magento',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/magento/action/{action}',
        initEndpoint: '/business/{businessId}/integration/magento/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '48355b1c-fa7c-4e4e-9fee-3297ef761220',
      icon: '#icon-magento',
      title: 'Magento',
      bgColor: '#F27C20-#F9B400',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '12b01330-db16-43ef-9b9e-14cbe7e428bc',
      links: [
        {
          _id: '26795866-7aa3-40e4-9291-d74d95da1b1c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/magento.png`,
        },
      ],
      optionIcon: '#icon-magento',
      price: 'integrations.shopsystems.magento.price',
      category: 'integrations.shopsystems.magento.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.magento.description',
      appSupport: 'https://getpayever.com/shopsystem/magento/',
      website: 'https://getpayever.com/shopsystem/magento/',
      pricingLink: 'https://magento.com/products/magento-commerce',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // magento Hyva
  {
    _id: 'b058a9cc-0a45-437e-8e99-105bac7b1a75',
    name: 'magento_hyva',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/magento_hyva/action/{action}',
        initEndpoint: '/business/{businessId}/integration/magento_hyva/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '359f70f0-3b74-45fb-aaab-36d04e8b703c',
      icon: '#icon-magento-hyva',
      title: 'Hyva',
      bgColor: '#F27C20-#F9B400',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: '4225f8f0-9c92-4a5a-8daf-3377a83a042e',
      links: [
        {
          _id: 'd43b75a6-2f28-4e90-adb2-0f67dc92cc39',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/hyva.png`,
        },
      ],
      optionIcon: '#icon-magento-hyva',
      price: 'integrations.shopsystems.magento_hyva.price',
      category: 'integrations.shopsystems.magento_hyva.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.magento_hyva.description',
      appSupport: 'https://getpayever.com/shopsystem/magento/',
      website: 'https://getpayever.com/shopsystem/magento/',
      pricingLink: 'https://www.hyva.io/hyva-checkout.html',
    },
    createdAt: '2024-06-19T14:15:47.340+0000',
    updatedAt: '2024-11-19T14:15:47.340+0000',
  },

  // oxid
  {
    _id: '3be5ba72-c4a7-4ed9-8080-356d30300dbc',
    name: 'oxid',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/oxid/action/{action}',
        initEndpoint: '/business/{businessId}/integration/oxid/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '94da6fa8-c1b7-4012-9e3a-6ac329877b80',
      icon: '#icon-oxid',
      title: 'OXID',
      bgColor: '#CF342C-#FF4037',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE'
      ],
      _id: 'ddc75f1e-e10e-4614-bdaf-d7364c19b614',
      links: [
        {
          _id: 'ff10742f-9179-4489-95d8-e359b2e02c06',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/oxid.png`,
        },
      ],
      optionIcon: '#icon-oxid',
      price: 'integrations.shopsystems.oxid.price',
      category: 'integrations.shopsystems.oxid.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.oxid.description',
      appSupport: 'https://getpayever.com/shopsystem/oxid/',
      website: 'https://getpayever.com/shopsystem/oxid/',
      pricingLink: 'https://www.oxid-esales.com/en/e-commerce-platform/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // plentymarkets
  {
    _id: '5eb19e7c-f56b-49cd-bc12-91ee396506ee',
    name: 'plentymarkets',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/plentymarkets/action/{action}',
        initEndpoint: '/business/{businessId}/integration/plentymarkets/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '6f77d5e6-af10-4639-9d2e-20b17ce5279e',
      icon: '#icon-plenty-markets-bw',
      title: 'integrations.shopsystems.plentymarkets.title',
      bgColor: '#D3021D-#D30200',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE'
      ],
      _id: 'a4ad2ce6-872b-4342-98c2-f397942dbd2b',
      links: [
        {
          _id: '6fb7d040-a51e-4b3f-bf42-a6fe41247eb6',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/plentymarkets.png`,
        },
      ],
      optionIcon: '#icon-plenty-markets-bw',
      price: 'integrations.shopsystems.plentymarkets.price',
      category: 'integrations.shopsystems.plentymarkets.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.plentymarkets.description',
      appSupport: 'https://getpayever.com/help/',
      website: 'https://getpayever.com/shopsystem/',
      pricingLink: 'https://www.plentymarkets.co.uk/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // presta
  {
    _id: 'fe0abeb1-0f2e-4786-af84-436720642261',
    name: 'presta',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/presta/action/{action}',
        initEndpoint: '/business/{businessId}/integration/presta/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: 'cefec45b-1e71-4fd3-a644-61597869fec6',
      icon: '#icon-prestashop-bw',
      title: 'Prestashop',
      bgColor: '#97CADA-#A4DBEA',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'fb98bfdc-0ee4-4e0e-84f4-9edbc76f908a',
      links: [
        {
          _id: '7361a0c3-aaec-46c0-b223-4e07da3db072',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/prestashop.png`,
        },
      ],
      optionIcon: '#icon-prestashop-bw',
      price: 'integrations.shopsystems.presta.price',
      category: 'integrations.shopsystems.presta.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.presta.description',
      appSupport: 'https://getpayever.com/shopsystem/presta/',
      website: 'https://getpayever.com/shopsystem/presta/',
      pricingLink: 'https://www.prestashop.com/en/software-ecommerce',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // shopify
  {
    _id: '452d4391-9be9-44c0-9ef0-3795df38a847',
    name: 'shopify',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/shopify/action/{action}',
        initEndpoint: '/business/{businessId}/integration/shopify/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_PLUGINS}/api',
    },
    displayOptions: {
      _id: '98691cf0-623d-4987-8508-736242ba43ce',
      icon: '#icon-shopify',
      title: 'Shopify',
      bgColor: '#698D48-#36A645',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'af041e4b-4c6f-4e3d-81d5-a029285e733a',
      links: [
        {
          _id: '6ce8cdcb-cf4b-4fc0-88ea-5cc33131634e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/shopify.png`,
        },
      ],
      optionIcon: '#icon-shopify',
      price: 'integrations.shopsystems.shopify.price',
      category: 'integrations.shopsystems.shopify.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.shopify.description',
      appSupport: 'https://getpayever.com/shopsystem/shopify/',
      website: 'https://getpayever.com/shopsystem/shopify/',
      pricingLink: 'https://www.shopify.com/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // shopware
  {
    _id: '214c9fbb-8c0d-4c7c-b851-959d5219cd6f',
    name: 'shopware',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/shopware/action/{action}',
        initEndpoint: '/business/{businessId}/integration/shopware/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '0743eb73-fdd4-4af8-817a-e58590a200c4',
      icon: '#icon-shopware',
      title: 'Shopware',
      bgColor: '#4D61E9-#6DB8EB',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'e14a0503-9048-4578-82a6-ce22a674eb59',
      links: [
        {
          _id: 'b0d6ac7d-2d28-420f-8272-9a1ef466fa12',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/shopware.png`,
        },
      ],
      optionIcon: '#icon-shopware',
      price: 'integrations.shopsystems.shopware.price',
      category: 'integrations.shopsystems.shopware.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.shopware.description',
      appSupport: 'https://getpayever.com/shopsystem/shopware/',
      website: 'https://getpayever.com/shopsystem/shopware/',
      pricingLink: 'https://en.shopware.com/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // xt_commerce
  {
    _id: '3b64af61-09c2-427c-9563-1114926ba1d5',
    name: 'xt_commerce',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/xt_commerce/action/{action}',
        initEndpoint: '/business/{businessId}/integration/xt_commerce/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '984fda86-77f1-4506-8889-2ffdde17c022',
      icon: '#icon-xt-commerce-bw',
      title: 'xt:Commerce',
      bgColor: '#E17F00-#FF9103',
    },
    enabled: true,
    installationOptions: {
      countryList: [
        'DE'
      ],
      _id: '201b7b24-60a6-4d9a-a998-81cfcc35109c',
      links: [
        {
          _id: 'fe7e5df0-7f47-4a95-84c8-aa94b109dcf7',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/xt.png`,
        },
      ],
      optionIcon: '#icon-xt-commerce-bw',
      price: 'integrations.shopsystems.xt_commerce.price',
      category: 'integrations.shopsystems.xt_commerce.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.xt_commerce.description',
      appSupport: 'https://getpayever.com/shopsystem/xt-commerce/',
      website: 'https://getpayever.com/shopsystem/xt-commerce/',
      pricingLink: 'https://www.xt-commerce.com/xtcommerce-6-der-uberblick/',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },

  // woo_commerce
  {
    _id: '630160ac-c6e7-44d2-8bfb-aab91f430fcc',
    name: 'woo_commerce',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/woo_commerce/action/{action}',
        initEndpoint: '/business/{businessId}/integration/woo_commerce/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '15c68ce3-3920-48cc-83f5-2f2e9385d54c',
      icon: '#icon-woo-commerce-bw',
      title: 'integrations.shopsystems.woo_commerce.title',
      bgColor: '#603B90-#9A60E4',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'b685264c-74d4-4fc7-81ef-a92db31ae8cb',
      links: [
        {
          _id: '8d0abd2c-a41d-42c2-adaf-3adf2fe7c0d8',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/woocommerce.png`,
        },
      ],
      optionIcon: '#icon-woo-commerce-bw',
      price: 'integrations.shopsystems.woo_commerce.price',
      category: 'integrations.shopsystems.woo_commerce.category',
      developer: 'integrations.shopsystems.woo_commerce.developer',
      languages: 'integrations.shopsystems.woo_commerce.languages',
      description: 'integrations.shopsystems.woo_commerce.description',
      appSupport: 'integrations.shopsystems.woo_commerce.support_link',
      website: 'https://getpayever.com/shopsystem/woocommerce/',
      pricingLink: 'https://woocommerce.com/#',
    },
    createdAt: '2018-11-12T18:13:41.340+0000',
    updatedAt: '2018-11-12T18:13:41.340+0000',
  },



  /* SOCIAL */

  // facebook-posts
  {
    _id: '91b4cf4a-5132-4296-a130-5353f9bb5096',
    name: 'facebook-posts',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/facebook-posts/action/{action}',
        initEndpoint: '/business/{businessId}/integration/facebook-posts/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-facebook',
      title: 'integrations.social.facebook_posts.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/facebook.png`,
        },
      ],
      optionIcon: '#icon-products-facebook-posts',
      price: 'integrations.products.facebook-posts.price',
      category: 'integrations.products.facebook-posts.category',
      developer: 'integrations.products.facebook-posts.developer',
      languages: 'integrations.products.facebook-posts.languages',
      description: 'integrations.products.facebook-posts.description',
      appSupport: 'integrations.products.facebook-posts.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.facebook.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // instagram-posts
  {
    _id: '91b4cf4a-5132-4296-a130-5353f9bb5097',
    name: 'instagram-posts',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/instagram-posts/action/{action}',
        initEndpoint: '/business/{businessId}/integration/instagram-posts/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-apps-instagram-28',
      title: 'integrations.social.instagram-posts.title',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/instagram.png`,
        },
      ],
      optionIcon: '#icon-products-instagram-posts',
      price: 'integrations.products.instagram-posts.price',
      category: 'integrations.products.instagram-posts.category',
      developer: 'integrations.products.instagram-posts.developer',
      languages: 'integrations.products.instagram-posts.languages',
      description: 'integrations.products.instagram-posts.description',
      appSupport: 'integrations.products.instagram-posts.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.instagram.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // linkedin
  {
    _id: '91b4cf4a-5132-4296-c130-1253f9bb1196',
    name: 'linkedin',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/linkedin/action/{action}',
        initEndpoint: '/business/{businessId}/integration/linkedin/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-linkedin',
      title: 'integrations.social.linkedin.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/linkedin.png`,
        },
      ],
      optionIcon: '#icon-products-linkedin',
      price: 'integrations.products.linkedin.price',
      category: 'integrations.products.linkedin.category',
      developer: 'integrations.products.linkedin.developer',
      languages: 'integrations.products.linkedin.languages',
      description: 'integrations.products.linkedin.description',
      appSupport: 'integrations.products.linkedin.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.linkedin.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // pinterest
  {
    _id: 'dacb5f07-ee9c-4fbb-8f71-83a322f93dcf',
    name: 'pinterest',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/pinterest/action/{action}',
        initEndpoint: '/business/{businessId}/integration/pinterest/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: '9316decc-718e-4fcf-9243-1e14c3b85e29',
      icon: '#icon-products-pinterest',
      title: 'integrations.social.pinterest.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '11559564-7d9c-4968-a799-5f9b5ab03de6',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/pinterest.png`,
        },
      ],
      optionIcon: '#icon-products-pinterest',
      price: 'integrations.products.pinterest.price',
      category: 'integrations.products.pinterest.category',
      developer: 'integrations.products.pinterest.developer',
      languages: 'integrations.products.pinterest.languages',
      description: 'integrations.products.pinterest.description',
      appSupport: 'integrations.products.pinterest.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.pinterest.com/',
    },
    createdAt: '2022-05-25T18:13:41.339+0000',
    updatedAt: '2022-06-01T18:14:49.339+0000',
  },

  // twitter
  {
    _id: '91b4cf4a-5132-4296-a130-5353f9bb1196',
    name: 'twitter',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/twitter/action/{action}',
        initEndpoint: '/business/{businessId}/integration/twitter/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-twitter',
      title: 'integrations.social.twitter.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/twitter.png`,
        },
      ],
      optionIcon: '#icon-products-twitter',
      price: 'integrations.products.twitter.price',
      category: 'integrations.products.twitter.category',
      developer: 'integrations.products.twitter.developer',
      languages: 'integrations.products.twitter.languages',
      description: 'integrations.products.twitter.description',
      appSupport: 'integrations.products.twitter.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.twitter.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // youtube
  {
    _id: '91b4cf4a-5144-4296-a130-5353f9bb5096',
    name: 'youtube',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/youtube/action/{action}',
        initEndpoint: '/business/{businessId}/integration/youtube/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-youtube',
      title: 'integrations.social.youtube.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/youtube.png`,
        },
      ],
      optionIcon: '#icon-products-youtube',
      price: 'integrations.products.youtube.price',
      category: 'integrations.products.youtube.category',
      developer: 'integrations.products.youtube.developer',
      languages: 'integrations.products.youtube.languages',
      description: 'integrations.products.youtube.description',
      appSupport: 'integrations.products.youtube.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.youtube.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },

  // ivy
  {
    _id: 'd1871cbc-7313-489f-8ebe-3222c80ac806',
    name: 'ivy',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/ivy/action/{action}',
        initEndpoint: '/business/{businessId}/integration/ivy/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '5e5b89de-d513-4f6f-90cd-dd9fe4e4b33b',
      icon: '#payment-method-ivy',
      title: 'integrations.payments.ivy.title',
    },
    enabled: true,
    installationOptions: {
      _id: '57142917-06be-4e15-a00c-0cea88d7dbbd',
      countryList: [],
      links: [
        {
          _id: 'c86593c3-7aad-4054-81eb-98f888b1cbc9',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/ivy.png`,
        },
      ],
      optionIcon: '#icon-payment-option-ivy',

      appSupport: 'integrations.payments.ivy.support_link',
      category: 'integrations.payments.ivy.category',
      description: 'integrations.payments.ivy.description',
      developer: 'integrations.payments.ivy.developer',
      languages: 'integrations.payments.ivy.languages',
      price: 'integrations.payments.ivy.price',
      pricingLink: 'integrations.payments.ivy.pricing_link',
      website: 'integrations.payments.ivy.website_link',
    },
    createdAt: '2022-09-27T18:03:00.000+0000',
    updatedAt: '2022-09-27T18:03:00.000+0000',
  },

  // ideal
  {
    _id: 'a19ff1aa-000b-4f10-a581-593d5067504f',
    name: 'ideal',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/ideal/action/{action}',
        initEndpoint: '/business/{businessId}/integration/ideal/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '5e5b89de-d513-4f6f-90cd-dd9fe4e4b33b',
      icon: '#payment-method-ideal',
      title: 'integrations.payments.ideal.title',
    },
    enabled: true,
    installationOptions: {
      _id: '57142917-06be-4e15-a00c-0cea88d7dbbd',
      countryList: [],
      links: [
        {
          _id: 'c86593c3-7aad-4054-81eb-98f888b1cbc9',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/ideal.png`,
        },
      ],
      optionIcon: '#icon-payment-option-ideal',

      appSupport: 'integrations.payments.ideal.support_link',
      category: 'integrations.payments.ideal.category',
      description: 'integrations.payments.ideal.description',
      developer: 'integrations.payments.ideal.developer',
      languages: 'integrations.payments.ideal.languages',
      price: 'integrations.payments.ideal.price',
      pricingLink: 'integrations.payments.ideal.pricing_link',
      website: 'integrations.payments.ideal.website_link',
    },
    createdAt: '2023-03-15T18:03:00.000+0000',
    updatedAt: '2023-03-15T18:03:00.000+0000',
  },

  // vipps
  {
    _id: '635ecd9b-65b6-42c3-96ad-99dd240e6746',
    name: 'vipps',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/vipps/action/{action}',
        initEndpoint: '/business/{businessId}/integration/vipps/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'e12ca7b0-2099-4402-add3-11e34ceb2205',
      icon: '#icon-payment-option-vipps',
      title: 'integrations.payments.vipps.title',
      bgColor: '#FE512C-#FEA150',
    },
    enabled: true,
    installationOptions: {
      _id: 'aaf6cdc3-20b6-4a76-94c8-a5bb087c515a',
      countryList: [
        'NO'
      ],
      links: [
        {
          _id: '72f703a6-787b-4e71-b91b-0947f06f801a',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/vipps.png`,
        },
      ],
      optionIcon: '#icon-payment-option-vipps',
      appSupport: 'integrations.payments.vipps.support_link',
      category: 'integrations.payments.vipps.category',
      description: 'integrations.payments.vipps.description',
      developer: 'integrations.payments.vipps.developer',
      languages: 'integrations.payments.vipps.languages',
      price: 'integrations.payments.vipps.price',
      pricingLink: 'integrations.payments.vipps.pricing_link',
      website: 'integrations.payments.vipps.website_link',
    },
    createdAt: '2023-03-20T14:57:00.000+0000',
    updatedAt: '2023-03-20T14:57:00.000+0000',
  },

  // swish
  {
    _id: '07f86770-d72e-401f-b41b-d97a7b0d0f90',
    name: 'swish',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/swish/action/{action}',
        initEndpoint: '/business/{businessId}/integration/swish/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: 'c71f89aa-e81b-42fc-bbce-029ff300cd7e',
      icon: '#icon-payment-option-swish',
      title: 'integrations.payments.swish.title',
      bgColor: '#FE512C-#FEA150',
    },
    enabled: true,
    installationOptions: {
      _id: '0cff58eb-b15d-44fc-bba0-b5eaae211d5a',
      countryList: [
        'SE'
      ],
      links: [
        {
          _id: 'ce90e3a5-d793-469a-a9f1-b2df362e3c65',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/swish.png`,
        },
      ],
      optionIcon: '#icon-payment-option-swish',
      appSupport: 'integrations.payments.swish.support_link',
      category: 'integrations.payments.swish.category',
      description: 'integrations.payments.swish.description',
      developer: 'integrations.payments.swish.developer',
      languages: 'integrations.payments.swish.languages',
      price: 'integrations.payments.swish.price',
      pricingLink: 'integrations.payments.swish.pricing_link',
      website: 'integrations.payments.swish.website_link',
    },
    createdAt: '2023-03-21T18:05:00.000+0000',
    updatedAt: '2023-03-21T18:05:00.000+0000',
  },

  // mobile_pay
  {
    _id: '783281fe-fa96-44b2-af03-3d3efb82c814',
    name: 'mobile_pay',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/mobile_pay/action/{action}',
        initEndpoint: '/business/{businessId}/integration/mobile_pay/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '07efa15a-1500-44b4-b2b9-bef745d32a2d',
      icon: '#icon-payment-option-mobile_pay',
      title: 'integrations.payments.mobile_pay.title',
      bgColor: '#FE512C-#FEA150',
    },
    enabled: true,
    installationOptions: {
      _id: 'aaf25d5d-f7b9-412e-879f-603cfaa4e1fc',
      countryList: [
        'DK',
        'FI',
      ],
      links: [
        {
          _id: '4574b1c2-1c95-4663-a5fa-cb7877fdc95e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/mobile-pay.png`,
        },
      ],
      optionIcon: '#icon-payment-option-mobile_pay',
      appSupport: 'integrations.payments.mobile_pay.support_link',
      category: 'integrations.payments.mobile_pay.category',
      description: 'integrations.payments.mobile_pay.description',
      developer: 'integrations.payments.mobile_pay.developer',
      languages: 'integrations.payments.mobile_pay.languages',
      price: 'integrations.payments.mobile_pay.price',
      pricingLink: 'integrations.payments.mobile_pay.pricing_link',
      website: 'integrations.payments.mobile_pay.website_link',
    },
    createdAt: '2023-03-23T16:25:00.000+0000',
    updatedAt: '2023-03-23T16:25:00.000+0000',
  },

  // santander_installment_be
  {
    _id: 'c44d02e3-f397-4a44-93f8-d298f6e167a2',
    name: 'santander_installment_be',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/santander_installment_be/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_installment_be/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '9e03e6a5-186b-4ee0-9eff-26cf00b17a72',
      icon: '#payment-method-santander_installment_be',
      title: 'integrations.payments.santander_installment_be.title',
    },
    enabled: true,
    installationOptions: {
      _id: 'ee44f47f-a3d8-4288-8a78-7533de1e35d5',
      countryList: [
        'BE'
      ],
      links: [
        {
          _id: '4acdce47-6fbb-455d-832a-705aebbc7f16',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-belgium.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander_installment_be',

      appSupport: 'integrations.payments.santander_installment_be.support_link',
      category: 'integrations.payments.santander_installment_be.category',
      description: 'integrations.payments.santander_installment_be.description',
      developer: 'integrations.payments.santander_installment_be.developer',
      languages: 'integrations.payments.santander_installment_be.languages',
      price: 'integrations.payments.santander_installment_be.price',
      pricingLink: 'integrations.payments.santander_installment_be.pricing_link',
      website: 'integrations.payments.santander_installment_be.website_link',
    },
    createdAt: '2023-01-11T18:03:00.000+0000',
    updatedAt: '2023-01-11T18:03:00.000+0000',
  },

  // allianz_trade_b2b_bnpl
  {
    _id: '136312e8-e6c9-41d5-a6af-bf87729e66c3',
    name: 'allianz_trade_b2b_bnpl',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/allianz_trade_b2b_bnpl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/allianz_trade_b2b_bnpl/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '5c7950ce-2380-4555-a3f7-085bdefb1e16',
      icon: '#payment-method-allianz_trade_b2b_bnpl',
      title: 'integrations.payments.allianz_trade_b2b_bnpl.title',
    },
    enabled: true,
    installationOptions: {
      _id: 'ee44f47f-a3d8-4288-8a78-7533de1e35d5',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: '00bc5b42-9f8d-43a5-8dcd-121392d9c678',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/allianz.png`,
        },
      ],
      optionIcon: '#icon-payment-option-allianz_trade_b2b_bnpl',

      appSupport: 'integrations.payments.allianz_trade_b2b_bnpl.support_link',
      category: 'integrations.payments.allianz_trade_b2b_bnpl.category',
      description: 'integrations.payments.allianz_trade_b2b_bnpl.description',
      developer: 'integrations.payments.allianz_trade_b2b_bnpl.developer',
      languages: 'integrations.payments.allianz_trade_b2b_bnpl.languages',
      price: 'integrations.payments.allianz_trade_b2b_bnpl.price',
      pricingLink: 'integrations.payments.allianz_trade_b2b_bnpl.pricing_link',
      website: 'integrations.payments.allianz_trade_b2b_bnpl.website_link',
    },
    createdAt: '2023-04-26T13:00:00.000+0000',
    updatedAt: '2023-04-26T13:00:00.000+0000',
  },

  // opencart
  {
    _id: 'dd2e6bf2-0765-4acf-a6cb-6efb9a262df1',
    name: 'opencart',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/opencart/action/{action}',
        initEndpoint: '/business/{businessId}/integration/opencart/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: 'c9732b32-9311-463c-979a-ef7d6821b709',
      icon: '#icon-opencart',
      title: 'OpenCart',
      bgColor: '#F27C20-#F9B400',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: '017f7056-f90c-46a2-83a1-7b7c2cb520a4',
      links: [
        {
          _id: '16d4c662-9c4b-4e93-bde6-533321761b93',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/opencart.png`,
        },
      ],
      optionIcon: '#icon-opencart',
      price: 'integrations.shopsystems.opencart.price',
      category: 'integrations.shopsystems.opencart.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.opencart.description',
      appSupport: 'https://getpayever.com/shopsystem/opencart/',
      website: 'https://getpayever.com/shopsystem/opencart/',
      pricingLink: 'https://opencart.com/products/opencart-commerce',
    },
    createdAt: '2023-05-01T18:13:41.340+0000',
    updatedAt: '2023-05-01T18:13:41.340+0000',
  },

  // oro_commerce
  {
    _id: 'e2829d35-b41f-4af6-a047-48e1a511e438',
    name: 'oro_commerce',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/oro_commerce/action/{action}',
        initEndpoint: '/business/{businessId}/integration/oro_commerce/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '259791a3-fa03-4660-ac13-184cdaa2312f',
      icon: '#icon-oro-commerce',
      title: 'OroCommerce',
      bgColor: '#F27C20-#F9B400',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: 'dae2a190-75b9-4f85-acd5-2e8adc19930c',
      links: [
        {
          _id: '3fb71120-294e-4f96-ae21-a0d0ef01e8c9',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/oro-commerce.png`,
        },
      ],
      optionIcon: '#icon-oro_commerce',
      price: 'integrations.shopsystems.oro_commerce.price',
      category: 'integrations.shopsystems.oro_commerce.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.oro_commerce.description',
      appSupport: 'https://getpayever.com/shopsystem/oro-commerce/',
      website: 'https://getpayever.com/shopsystem/oro-commerce/',
      pricingLink: 'https://oroinc.com/b2b-ecommerce/editions/',
    },
    createdAt: '2023-08-28T18:13:41.340+0000',
    updatedAt: '2023-08-28T18:13:41.340+0000',
  },

  // shopware_cloud
  {
    _id: 'f01217bd-98c0-408e-a69c-bec740ff9533',
    name: 'shopware_cloud',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/shopware_cloud/action/{action}',
        initEndpoint: '/business/{businessId}/integration/shopware_cloud/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '3e44584e-50b9-48ac-beee-da2b69cc2082',
      icon: '#icon-shopware-cloud',
      title: 'ShopwareCloud',
      bgColor: '#F27C20-#F9B400',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: '79cb5755-7277-4a12-b9c1-9857c0e29d14',
      links: [
        {
          _id: '949e4ef2-5a65-4f2d-b39e-18ec58953978',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/shopware-cloud.png`,
        },
      ],
      optionIcon: '#icon-shopware-cloud',
      price: 'integrations.shopsystems.shopware_cloud.price',
      category: 'integrations.shopsystems.shopware_cloud.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.shopsystems.shopware_cloud.description',
      appSupport: 'https://getpayever.com/shopsystem/shopware-cloud/',
      website: 'https://getpayever.com/shopsystem/shopware-cloud/',
      pricingLink: 'https://www.shopware.com/en/shopware-cloud/',
    },
    createdAt: '2023-08-28T18:13:41.340+0000',
    updatedAt: '2023-08-28T18:13:41.340+0000',
  },

  // trustly
  {
    _id: '4ed3bee4-dc12-44cf-88d1-48fd471568bf',
    name: 'trustly',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/trustly/action/{action}',
        initEndpoint: '/business/{businessId}/integration/trustly/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '07efa15a-1500-44b4-b2b9-bef745d32a2d',
      icon: '#icon-payment-option-trustly',
      title: 'integrations.payments.trustly.title',
      bgColor: '#FE512C-#FEA150',
    },
    enabled: false,
    installationOptions: {
      _id: 'ac4ba882-87f6-4767-808d-914af8a7e944',
      countryList: [
        'SE`',
        'FI',
      ],
      links: [
        {
          _id: '9cfd0d57-c06e-42eb-9482-28db19776ba2',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/trustly.png`,
        },
      ],
      optionIcon: '#icon-payment-option-trustly',
      appSupport: 'integrations.payments.trustly.support_link',
      category: 'integrations.payments.trustly.category',
      description: 'integrations.payments.trustly.description',
      developer: 'integrations.payments.trustly.developer',
      languages: 'integrations.payments.trustly.languages',
      price: 'integrations.payments.trustly.price',
      pricingLink: 'integrations.payments.trustly.pricing_link',
      website: 'integrations.payments.trustly.website_link',
    },
    createdAt: '2023-05-04T10:07:00.000+0000',
    updatedAt: '2023-05-04T10:07:00.000+0000',
  },

  // psa_b2b_bnpl
  {
    _id: 'cb02ffb9-1299-4d1c-9c8e-15a887ffe643',
    name: 'psa_b2b_bnpl',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/psa_b2b_bnpl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/psa_b2b_bnpl/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '57264ed2-a28f-4143-9d2a-d89985ff69a0',
      icon: '#payment-method-psa_b2b_bnpl',
      title: 'integrations.payments.psa_b2b_bnpl.title',
    },
    enabled: true,
    installationOptions: {
      _id: '26effb58-31b9-4a80-9810-1f72972c421e',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: 'bcdfedc3-3180-41f7-9d61-051c137eef00',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-b2b.png`,
        },
      ],
      optionIcon: '#icon-payment-option-psa_b2b_bnpl',

      appSupport: 'integrations.payments.psa_b2b_bnpl.support_link',
      category: 'integrations.payments.psa_b2b_bnpl.category',
      description: 'integrations.payments.psa_b2b_bnpl.description',
      developer: 'integrations.payments.psa_b2b_bnpl.developer',
      languages: 'integrations.payments.psa_b2b_bnpl.languages',
      price: 'integrations.payments.psa_b2b_bnpl.price',
      pricingLink: 'integrations.payments.psa_b2b_bnpl.pricing_link',
      website: 'integrations.payments.psa_b2b_bnpl.website_link',
    },
    createdAt: '2023-06-02T13:00:00.000+0000',
    updatedAt: '2023-06-02T13:00:00.000+0000',
  },

  // nets from aci
  {
    _id: 'f3376c0e-1943-40a3-a2f0-f1cdda5ce43f',
    name: 'nets',
    category: 'payments',
    connect: {
      dynamicForm: true,
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/nets/issuer/aci/action/{action}',
        initEndpoint: '/business/{businessId}/integration/nets/issuer/aci/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '60a78636-00fb-4164-ad28-d2b4ba37a8e1',
      icon: '#payment-method-nets_aci',
      title: 'integrations.payments.nets_aci.title',
    },
    enabled: false,
    installationOptions: {
      _id: '1a01755b-5718-4796-89a0-30dcbb339f7d',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: '21a1a4b3-457b-4a76-ada5-5cbbb239c752',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/nets-aci.png`,
        },
      ],
      optionIcon: '#icon-payment-option-nets_aci',

      appSupport: 'integrations.payments.nets_aci.support_link',
      category: 'integrations.payments.nets_aci.category',
      description: 'integrations.payments.nets_aci.description',
      developer: 'integrations.payments.nets_aci.developer',
      languages: 'integrations.payments.nets_aci.languages',
      price: 'integrations.payments.nets_aci.price',
      pricingLink: 'integrations.payments.nets_aci.pricing_link',
      website: 'integrations.payments.nets_aci.website_link',
    },
    createdAt: '2023-08-22T09:00:00.000+0000',
    updatedAt: '2023-08-22T09:00:00.000+0000',
  },

  /* DESIGN */

  // figma
  {
    _id: 'e9634470-0ef3-4e8b-a2d9-b12e06009025',
    name: 'figma',
    category: 'design',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/figma/action/{action}',
        initEndpoint: '/business/{businessId}/integration/figma/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_DESIGN}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-design-figma',
      title: 'integrations.design.figma.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/design/figma.png`,
        },
      ],
      optionIcon: '#icon-design-figma',
      price: 'integrations.design.figma.price',
      category: 'integrations.design.figma.category',
      developer: 'integrations.design.figma.developer',
      languages: 'integrations.design.figma.languages',
      description: 'integrations.design.figma.description',
      appSupport: 'integrations.design.figma.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.figma.com/',
    },
    createdAt: '2023-09-25T10:00:00.339+0000',
    updatedAt: '2023-09-25T10:00:00.339+0000',
  },

  // shopify-design
  {
    _id: '5e8e609e-953a-47b4-b60c-294129fbe5bc',
    name: 'shopify-design',
    category: 'design',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/shopify-design/action/{action}',
        initEndpoint: '/business/{businessId}/integration/shopify-design/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_DESIGN}/api',
    },
    displayOptions: {
      _id: '98691cf0-623d-4987-8508-736242ba43ce',
      icon: '#icon-shopify',
      title: 'Shopify Design',
      bgColor: '#698D48-#36A645',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'af041e4b-4c6f-4e3d-81d5-a029285e733a',
      links: [
        {
          _id: '6ce8cdcb-cf4b-4fc0-88ea-5cc33131634e',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/shopify.png`,
        },
      ],
      optionIcon: '#icon-shopify',
      price: 'integrations.design.shopify.price',
      category: 'integrations.design.shopify.category',
      developer: 'payever GmbH',
      languages: 'German, English',
      description: 'integrations.design.shopify.description',
      appSupport: 'https://getpayever.com/shopsystem/shopify/',
      website: 'https://getpayever.com/shopsystem/shopify/',
      pricingLink: 'https://www.shopify.com/',
    },
    createdAt: '2023-10-12T18:13:41.340+0000',
    updatedAt: '2023-10-12T18:13:41.340+0000',
  },

  // bfs
  {
    _id: 'cb850f56-164f-4b98-b324-458f34d7a7ed',
    name: 'bfs_b2b_bnpl',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/bfs_b2b_bnpl/action/{action}',
        initEndpoint: '/business/{businessId}/integration/bfs_b2b_bnpl/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '8dc6ceda-89bb-4f95-9abe-4a08fefdd766',
      icon: '#payment-method-bfs_b2b_bnpl',
      title: 'integrations.payments.bfs_b2b_bnpl.title',
    },
    enabled: true,
    installationOptions: {
      _id: 'bf2987f8-98e6-4402-a89d-88ee48b6baf3',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: 'a2bc677e-62df-4024-9efa-a7d193e01a66',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/bfs_b2b_bnpl.png`,
        },
      ],
      optionIcon: '#icon-payment-option-bfs_b2b_bnpl',

      appSupport: 'integrations.payments.bfs_b2b_bnpl.support_link',
      category: 'integrations.payments.bfs_b2b_bnpl.category',
      description: 'integrations.payments.bfs_b2b_bnpl.description',
      developer: 'integrations.payments.bfs_b2b_bnpl.developer',
      languages: 'integrations.payments.bfs_b2b_bnpl.languages',
      price: 'integrations.payments.bfs_b2b_bnpl.price',
      pricingLink: 'integrations.payments.bfs_b2b_bnpl.pricing_link',
      website: 'integrations.payments.bfs_b2b_bnpl.website_link',
    },
    createdAt: '2024-01-16T13:00:00.000+0000',
    updatedAt: '2024-01-16T13:00:00.000+0000',
  },

  // hsbc
  {
    _id: 'de651c6a-7d07-4ac8-9268-5eedbc9309cb',
    name: 'hsbc',
    category: 'payments',
    connect: {
      dynamicForm: true,
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/hsbc/action/{action}',
        initEndpoint: '/business/{businessId}/integration/hsbc/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '95c56807-f0bf-4b40-b75c-b34d8cec33ef',
      icon: '#payment-method-hsbc',
      title: 'integrations.payments.hsbc.title',
    },
    enabled: false,
    installationOptions: {
      _id: '6b48bf64-d097-42fd-81de-74c2d66730a4',
      countryList: [],
      links: [
        {
          _id: 'c60548dc-4fd9-4b67-961b-e7ed9ee568dd',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/hsbc.png`,
        },
      ],
      optionIcon: '#icon-payment-option-hsbc',

      appSupport: 'integrations.payments.hsbc.support_link',
      category: 'integrations.payments.hsbc.category',
      description: 'integrations.payments.hsbc.description',
      developer: 'integrations.payments.hsbc.developer',
      languages: 'integrations.payments.hsbc.languages',
      price: 'integrations.payments.hsbc.price',
      pricingLink: 'integrations.payments.hsbc.pricing_link',
      website: 'integrations.payments.hsbc.website_link',
    },
    createdAt: '2024-02-05T15:37:00.000+0000',
    updatedAt: '2024-02-05T15:37:00.000+0000',
  },

  // santander_instant_at
  {
    _id: '156120bf-e1d7-4b73-a397-2842e7588d31',
    name: 'santander_instant_at',
    category: 'payments',
    connect: {
      dynamicForm: true,
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/santander_instant_at/action/{action}',
        initEndpoint: '/business/{businessId}/integration/santander_instant_at/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '68fe650b-3b0e-4b72-aa17-5ac1b9a159bf',
      icon: '#payment-method-santander_instant_at',
      title: 'integrations.payments.santander_instant_at.title',
    },
    enabled: false,
    installationOptions: {
      _id: 'e17ea35a-b76b-42af-a407-769188b4c537',
      countryList: [],
      links: [
        {
          _id: 'e4fc48d4-84e1-4bc0-809b-b94c47851240',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/santander-instant-at.png`,
        },
      ],
      optionIcon: '#icon-payment-option-santander_instant_at',

      appSupport: 'integrations.payments.santander_instant_at.support_link',
      category: 'integrations.payments.santander_instant_at.category',
      description: 'integrations.payments.santander_instant_at.description',
      developer: 'integrations.payments.santander_instant_at.developer',
      languages: 'integrations.payments.santander_instant_at.languages',
      price: 'integrations.payments.santander_instant_at.price',
      pricingLink: 'integrations.payments.santander_instant_at.pricing_link',
      website: 'integrations.payments.santander_instant_at.website_link',
    },
    createdAt: '2024-02-29T12:05:00.000+0000',
    updatedAt: '2024-02-29T12:05:00.000+0000',
  },

  // zinia_lending_de
  {
    _id: '58095b0d-fe11-4ef8-9162-00c759accaed',
    name: 'zinia_lending_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_lending_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_lending_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '2eedb071-ce9b-4499-a0c6-257dd7a3d4a6',
      icon: '#payment-method-zinia_lending_de',
      title: 'integrations.payments.zinia_lending_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: 'f8510f31-a9c8-4e1c-9a03-68c5407b69b8',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: 'fbc2910d-0588-43da-afca-459d6ef2b9ac',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-lending-de.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_lending_de',

      appSupport: 'integrations.payments.zinia_lending_de.support_link',
      category: 'integrations.payments.zinia_lending_de.category',
      description: 'integrations.payments.zinia_lending_de.description',
      developer: 'integrations.payments.zinia_lending_de.developer',
      languages: 'integrations.payments.zinia_lending_de.languages',
      price: 'integrations.payments.zinia_lending_de.price',
      pricingLink: 'integrations.payments.zinia_lending_de.pricing_link',
      website: 'integrations.payments.zinia_lending_de.website_link',
    },
    createdAt: '2024-06-06T18:00:00.000+0000',
    updatedAt: '2023-06-06T18:00:00.000+0000',
  },

  // zinia_pos_lending_de
  {
    _id: 'b74d6150-c79c-4c53-98f4-5f2fb65104c6',
    name: 'zinia_pos_lending_de',
    category: 'payments',
    connect: {
      formAction: {
        actionEndpoint:
          '/business/{businessId}/integration/zinia_pos_lending_de/action/{action}',
        initEndpoint: '/business/{businessId}/integration/zinia_pos_lending_de/form',
      },
      url: TPPM_URL,
    },
    displayOptions: {
      _id: '7ebbcd95-e1db-4dcc-aaba-c10afb9a82f5',
      icon: '#payment-method-zinia_pos_lending_de',
      title: 'integrations.payments.zinia_pos_lending_de.title',
    },
    enabled: true,
    installationOptions: {
      _id: '6ad1ff97-9df1-4aa1-a44b-26ac0e8548a2',
      countryList: [
        'DE'
      ],
      links: [
        {
          _id: '657333c8-767e-4cb1-a3c5-f8915cd34017',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/zinia-pos-lending-de.png`,
        },
      ],
      optionIcon: '#icon-payment-option-zinia_pos_lending_de',

      appSupport: 'integrations.payments.zinia_pos_lending_de.support_link',
      category: 'integrations.payments.zinia_pos_lending_de.category',
      description: 'integrations.payments.zinia_pos_lending_de.description',
      developer: 'integrations.payments.zinia_pos_lending_de.developer',
      languages: 'integrations.payments.zinia_pos_lending_de.languages',
      price: 'integrations.payments.zinia_pos_lending_de.price',
      pricingLink: 'integrations.payments.zinia_pos_lending_de.pricing_link',
      website: 'integrations.payments.zinia_pos_lending_de.website_link',
    },
    createdAt: '2024-06-06T18:00:00.000+0000',
    updatedAt: '2023-06-06T18:00:00.000+0000',
  },

  // smartstore
  {
    _id: 'fa53b524-4a17-463b-9083-74b875697c76',
    name: 'smartstore',
    category: 'shopsystems',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/smartstore/action/{action}',
        initEndpoint: '/business/{businessId}/integration/smartstore/form',
      },
      url: TPPLM_URL,
      sendApiKeys: true
    },
    displayOptions: {
      _id: '6a0ce424-6e53-4f02-a558-a97d0d6cb68d',
      icon: '#icon-smartstore',
      title: 'Smartstore',
      bgColor: '#F27C20-#F9B400',
    },
    enabled: false,
    installationOptions: {
      countryList: [],
      _id: 'ef5be257-794e-45c8-889f-714e23f4d2d8',
      links: [
        {
          _id: '89608021-acb5-4d65-96ae-29f327e47037',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/shopsystems/smartstore.png`,
        },
      ],
      optionIcon: '#icon-smartstore',
      price: 'integrations.shopsystems.smartstore.price',
      category: 'integrations.shopsystems.smartstore.category',
      developer: 'Smartstore AG',
      languages: 'German, English',
      description: 'integrations.shopsystems.smartstore.description',
      appSupport: 'https://support.payever.org/hc/en-us/articles/12812230024604-Smartstore',
      website: 'https://smartstore.com',
      pricingLink: 'https://smartstore.com/en/editions-prices/',
    },
    createdAt: '2024-05-13T14:13:41.340+0000',
    updatedAt: '2024-05-13T14:13:41.340+0000',
  },
];
