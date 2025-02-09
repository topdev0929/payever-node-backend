import { SectionInterface } from '../src/checkout';
import { CheckoutSection } from '../src/integration';

export const sectionsFixture: SectionInterface[] = [
  {
    _id: '45b733cf-151e-4125-bec8-7bbbbd59ec16',
    excluded_channels: [],
    code: CheckoutSection.Qr,
    order: -2,
    allowed_only_integrations:[],
    excluded_integrations:[],
    fixed: false,
    defaultEnabled: false,
    subsections: [
      {
        _id: 'f15f2645-7b4a-4751-9662-6e252873e0e0',
        rules: [],
        code: 'checkout-main-show-qr',
      },
    ],
  },
  {
    _id: '26cc1780-6dbd-4085-8002-b11056f21a35',
    excluded_channels: [],
    code: CheckoutSection.SendToDevice,
    allowed_only_integrations:[],
    excluded_integrations:[],
    order: -1,
    fixed: false,
    defaultEnabled: false,
    subsections: [
      {
        _id: 'd403d4c3-c447-4aab-a8c7-c7f184a8e77f',
        rules: [],
        code: 'checkout-send-to-device',
      },
    ],

  },
  {
    _id: '87695a9d-ab32-4fa5-b958-cf637eb6340a',
    excluded_channels: [
      'finance_express',
      'api',
      'dandomain',
      'jtl',
      'magento',
      'oxid',
      'plentymarkets',
      'presta',
      'shopify',
      'shopware',
      'woo_commerce',
      'xt_commerce',
      'commercetools',
      'ccvshop',
      'opencart',
      'oro_commerce',
      'shopware_cloud',
      'connectin',
      'smartstore',
    ],
    code: CheckoutSection.Order,
    fixed: true,
    defaultEnabled: true,
    allowed_only_integrations:[],
    excluded_integrations:[],
    order: 0,
    subsections: [
      {
        _id: '9a6ee51f-30d2-44f9-a880-3d0d4af5727b',
        rules: [
          {
            _id: '261e569a-7d98-444f-87b6-28cb21cf191e',
            type: 'flow_property',
            property: 'cart',
            operator: 'isNotEmpty',
          },
        ],
        code: 'cart',
      },
      {
        _id: '91cad3f0-d48a-4d37-a46f-5bfbacf36ad0',
        rules: [
          {
            _id: '3e809d11-0a15-4362-8c46-490e4520d428',
            type: 'flow_property',
            property: 'cart',
            operator: 'isEmpty',
          },
        ],
        code: 'amount_reference',
      },
    ],

  },
  {
    _id: '939dfaa7-908e-478a-bc68-1018da075eb6',
    excluded_channels: [
      'api',
      'dandomain',
      'jtl',
      'magento',
      'oxid',
      'plentymarkets',
      'presta',
      'shopify',
      'shopware',
      'woo_commerce',
      'xt_commerce',
      'commercetools',
      'ccvshop',
      'opencart',
      'oro_commerce',
      'shopware_cloud',
      'connectin',
      'smartstore',
    ],
    code: CheckoutSection.User,
    allowed_only_integrations:[],
    excluded_integrations:[],
    fixed: false,
    defaultEnabled: true,
    order: 1,
    subsections: [
      {
        _id: '9869c0b9-5c9f-47a4-b31c-1fc93c1cadaf',
        rules: [],
        code: 'checkout-main-user',
      },
    ],

  },
  {
    _id: '67b70735-bd5c-4894-b17f-1e9e8a7a1515',
    allowed_only_integrations:[],
    excluded_integrations:[
      'paypal', 'apple_pay', 'google_pay'
    ],
    excluded_channels: [
      'api',
      'dandomain',
      'jtl',
      'magento',
      'oxid',
      'plentymarkets',
      'presta',
      'shopify',
      'shopware',
      'woo_commerce',
      'xt_commerce',
      'commercetools',
      'ccvshop',
      'opencart',
      'oro_commerce',
      'shopware_cloud',
      'connectin',
      'smartstore',
    ],
    code: CheckoutSection.Address,
    fixed: false,
    defaultEnabled: true,
    order: 2,
    subsections: [
      {
        _id: 'ee04ca85-9885-4736-b468-f48691c95051',
        rules: [],
        code: 'checkout-main-address',
      },
    ],

  },
  {
    _id: 'e16ebb03-20f2-4517-a97b-41de5086f97a',
    allowed_only_integrations:[],
    excluded_integrations:[],
    excluded_channels: [
      'api',
      'dandomain',
      'jtl',
      'magento',
      'oxid',
      'plentymarkets',
      'presta',
      'shopify',
      'shopware',
      'woo_commerce',
      'xt_commerce',
      'commercetools',
      'ccvshop',
      'opencart',
      'oro_commerce',
      'shopware_cloud',
      'connectin',
      'smartstore',
    ],
    code: CheckoutSection.Shipping,
    fixed: false,
    defaultEnabled: false,
    order: 3,
    subsections: [
      {
        _id: 'c5164dbc-fd07-4984-a43d-a02e31ea1aa1',
        rules: [],
        code: 'checkout-main-shipping',
      },
    ],

  },
  {
    _id: 'bf23c107-0d37-47cf-b85f-6faea2a91d9b',
    allowed_only_channels: ['pos'],
    excluded_channels: [],
    allowed_only_integrations:[],
    excluded_integrations:[],
    code: CheckoutSection.Ocr,
    fixed: false,
    defaultEnabled: true,
    options: {
      skipButton: false,
    },
    order: 4,
    subsections: [
      {
        _id: '3b7badfc-e6a4-4499-b592-415a1a857ce6',
        rules: [],
        code: 'checkout-main-ocr',
      },
    ],

  },
  {
    _id: 'aaa84f89-e4b9-47f9-80f9-decf697294ea',
    excluded_channels: [

    ],
    code: CheckoutSection.ChoosePayment,
    fixed: true,
    defaultEnabled: true,
    allowed_only_integrations:[],
    excluded_integrations:[],
    order: 3,
    subsections: [
      {
        _id: 'a25f79e0-7aa3-4b01-bdaa-473a24806feb',
        rules: [],
        code: 'checkout-main-choose-payment',
      },
    ],

  },
  {
    _id: 'dc558619-fa10-4baf-978b-b2c33b1deb82',
    excluded_channels: [],
    code: CheckoutSection.Payment,
    fixed: true,
    allowed_only_integrations:[],
    excluded_integrations:[],
    defaultEnabled: true,
    order: 5,
    subsections: [
      {
        _id: '85104cf5-2b71-441b-a47b-19c74e25ae2d',
        rules: [

        ],
        code: 'checkout-main-payment',
      },
    ],

  },
  {
    _id: 'b16ebb03-20f2-4517-a97b-41de5086f96a',
    excluded_channels: [

    ],
    code: CheckoutSection.Coupons,
    fixed: false,
    allowed_only_integrations:[],
    excluded_integrations:[],
    defaultEnabled: false,
    order: 6,
    subsections: [
      {
        _id: 'b5164dbc-fd07-4984-a43d-a02e41ea1aa1',
        rules: [],
        code: 'checkout-main-coupons',
      },
    ],

  },
];
