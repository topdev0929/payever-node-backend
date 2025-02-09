/* eslint-disable-no-identical-functions no-duplicate-string object-literal-sort-keys */
import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { SectionInterface, SubsectionInterface } from '../../src/checkout/interfaces';
import { CheckoutSection } from '../../src/integration/enums';

type SubsectionType = SubsectionInterface & { _id: string; };
type SectionType = SectionInterface & {
  _id: string;
  subsections: SubsectionType[];
};

const LocalFactory: DefaultFactory<SectionType> = (): SectionType => {


  return {
    _id: uuid.v4(),
    excluded_channels: [],
    allowed_only_channels: [],
    allowed_only_integrations: [],
    excluded_integrations: [],
    code: CheckoutSection.Payment,
    order: 0,
    fixed: false,
    defaultEnabled: false,
    subsections: [
      {
        _id: uuid.v4(),
        rules: [],
        code: 'checkout-send-to-device',
      },
    ],
  };
};

export class SectionFactory {
  public static create: PartialFactory<SectionType> = partialFactory<SectionType>(LocalFactory);

  public static createDefaultSections(): SectionType[] {
    const sections: SectionType[] = [];

    sections.push(this.createSendToDeviceSection());
    sections.push(this.createOrderSection());
    sections.push(this.createUserSection());
    sections.push(this.createAddressSection());
    sections.push(this.createShippingSection());
    sections.push(this.createChoosePaymentSection());
    sections.push(this.createPaymentSection());
    sections.push(this.createOCRSection());

    return sections;
  }

  public static createSendToDeviceSection(): SectionType {
    return this.create({
      _id: '26cc1780-6dbd-4085-8002-b11056f21a35',
      code: CheckoutSection.SendToDevice,
      order: -1,
      fixed: false,
      defaultEnabled: false,
      excluded_channels: [],
      subsections: [
        {
          _id: 'd403d4c3-c447-4aab-a8c7-c7f184a8e77f',
          rules: [],
          code: 'checkout-send-to-device',
        },
      ] as any,
    });
  }

  public static createOrderSection(): SectionType {
    return this.create({
      _id: '87695a9d-ab32-4fa5-b958-cf637eb6340a',
      code: CheckoutSection.Order,
      fixed: true,
      defaultEnabled: true,
      allowed_only_channels: ['pos'],
      options: {},
      order: 0,
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
        'opencart',
        'oro_commerce',
        'shopware_cloud',
        'shopware',
        'woo_commerce',
        'xt_commerce',
        'commercetools',
        'ccvshop',
        'connectin',
        'smartstore',
      ],
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
    } as any);
  }

  public static createUserSection(): SectionType {
    return this.create({
      _id: '939dfaa7-908e-478a-bc68-1018da075eb6',
      code: CheckoutSection.User,
      fixed: false,
      defaultEnabled: true,
      options: {},
      order: 1,
      excluded_channels: [
        'api',
        'dandomain',
        'jtl',
        'magento',
        'oxid',
        'plentymarkets',
        'presta',
        'shopify',
        'opencart',
        'oro_commerce',
        'shopware_cloud',
        'shopware',
        'woo_commerce',
        'xt_commerce',
        'commercetools',
        'ccvshop',
        'connectin',
        'smartstore',
      ],
      subsections: [
        {
          _id: '9869c0b9-5c9f-47a4-b31c-1fc93c1cadaf',
          rules: [],
          code: 'checkout-main-user',
        },
      ],
    } as any);
  }

  public static createAddressSection(): SectionType {
    return this.create({
      _id: '67b70735-bd5c-4894-b17f-1e9e8a7a1515',
      code: CheckoutSection.Address,
      excluded_integrations: [
        'paypal', 'apple_pay', 'google_pay'
      ],
      fixed: false,
      defaultEnabled: true,
      options: {},
      order: 2,
      excluded_channels: [
        'api',
        'dandomain',
        'jtl',
        'magento',
        'oxid',
        'plentymarkets',
        'presta',
        'shopify',
        'opencart',
        'oro_commerce',
        'shopware_cloud',
        'shopware',
        'woo_commerce',
        'xt_commerce',
        'commercetools',
        'ccvshop',
        'connectin',
        'smartstore',
      ],
      subsections: [
        {
          _id: 'ee04ca85-9885-4736-b468-f48691c95051',
          rules: [],
          code: 'checkout-main-address',
        },
      ],
    });
  }

  public static createShippingSection(): SectionType {
    return this.create({
      _id: 'e16ebb03-20f2-4517-a97b-41de5086f97a',
      excluded_channels: [],
      code: CheckoutSection.Shipping,
      fixed: false,
      defaultEnabled: false,
      options: {},
      order: 3,
      subsections: [
        {
          _id: 'c5164dbc-fd07-4984-a43d-a02e31ea1aa1',
          rules: [],
          code: 'checkout-main-shipping',
        },
      ],
    } as any);
  }

  public static createChoosePaymentSection(): SectionType {
    return this.create({
      _id: 'aaa84f89-e4b9-47f9-80f9-decf697294ea',
      excluded_channels: [],
      code: CheckoutSection.ChoosePayment,
      fixed: true,
      defaultEnabled: true,
      options: {},
      order: 4,
      subsections: [
        {
          _id: 'a25f79e0-7aa3-4b01-bdaa-473a24806feb',
          rules: [],
          code: 'checkout-main-choose-payment',
        },
      ],
    } as any);
  }

  public static createPaymentSection(): SectionType {
    return this.create({
      _id: 'dc558619-fa10-4baf-978b-b2c33b1deb82',
      excluded_channels: [],
      code: CheckoutSection.Payment,
      fixed: true,
      defaultEnabled: true,
      options: {},
      order: 5,
      subsections: [
        {
          _id: '85104cf5-2b71-441b-a47b-19c74e25ae2d',
          rules: [],
          code: 'checkout-main-payment',
        },
      ],
    } as any);
  }

  public static createOCRSection(): SectionType {
    return this.create({
      allowed_only_channels: [
        'pos'
      ],
      excluded_channels: [],
      _id: 'bf23c107-0d37-47cf-b85f-6faea2a91d9b',
      code: 'ocr',
      fixed: false,
      defaultEnabled: true,
      order: 6,
      options: {
        skipButton: false
      },
      subsections: [
        {
          _id: '3b7badfc-e6a4-4499-b592-415a1a857ce6',
          rules: [],
          code: 'checkout-main-ocr'
        }
      ],
      enabled: true
    } as any);
  }
}
