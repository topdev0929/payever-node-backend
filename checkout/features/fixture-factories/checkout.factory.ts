import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import {
  CheckoutInterface,
  CheckoutSectionInterface,
  CheckoutSettingsInterface,
} from '../../src/checkout/interfaces';
import { CheckoutSection } from '../../src/integration/enums';

type CheckoutType = CheckoutInterface & { _id: string };

const LocalFactory: DefaultFactory<CheckoutType> = (): CheckoutType => {
  const sections: CheckoutSectionInterface[] = [
    {
      code: CheckoutSection.Order,
      enabled: true,
      options: {},
      order: 0,
    },
    {
      code: CheckoutSection.Address,
      enabled: true,
      options: {},
      order: 1,
    },
    {
      code: CheckoutSection.ChoosePayment,
      enabled: true,
      options: {},
      order: 2,
    },
    {
      code: CheckoutSection.Ocr,
      enabled: true,
      options: {
        skipButton: false,
      },
      order: 3,
    },
    {
      code: CheckoutSection.Payment,
      enabled: true,
      options: {},
      order: 4,
    },
    {
      code: CheckoutSection.User,
      enabled: false,
      options: {},
      order: 5,
    },
  ];

  const settings: CheckoutSettingsInterface = {
    cspAllowedHosts: [],
    languages: [
      {
        active: false,
        code: 'de',
        isDefault: false,
        name: 'Deutsch',
      },
      {
        active: true,
        code: 'en',
        isDefault: true,
        name: 'English',
      },
    ],
    styles: {
      businessHeaderBorderColor: '#ffff',
      buttonFill: true,
      active: true,
    },
    testingMode: false,
    enableCustomerAccount: false,
    enablePayeverTerms: false,
    enableLegalPolicy: false,
    enableDisclaimerPolicy: false,
    enableRefundPolicy: false,
    enableShippingPolicy: false,
    enablePrivacyPolicy: false
  };

  return {
    _id: uuid.v4(),
    businessId: uuid.v4(),
    default: true,
    name: `Checkout`,
    sections,
    settings: settings,

    connections: [],
  };
};

export class CheckoutFactory {
  public static create: PartialFactory<CheckoutType> = partialFactory<CheckoutType>(LocalFactory);
}
