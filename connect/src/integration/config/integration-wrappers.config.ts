import { IntegrationWrapperConfigInterface } from '../interfaces';
import { environment } from '../../environments';

const INSTALLATION_IMAGES_URL: string = `${environment.microUrlCustomCdn}/images/installation`;

// tslint:disable: object-literal-sort-keys
export const IntegrationWrapperConfigs: IntegrationWrapperConfigInterface[] = [
  // credit card
  {
    _id: '71f5b7c5-9355-49e1-a965-1b18da6dd948',
    wrapperType: 'credit_card',
    displayOptions: {
      _id: '81f5b7c5-9355-49e1-a965-1b18da6dd947',
      icon: '#icon-payment-option-credit-card',
      title: 'integrations.payments.credit-card.title',
      bgColor: '#59AFF9-#6755FF',
    },
    optionIcon: '#icon-payment-option-credit-card',
    category: 'integrations.payments.credit-card.category',
    developer: 'integrations.payments.credit-card.developer',
    languages: 'integrations.payments.credit-card.languages',
    description: 'integrations.payments.credit-card.description',
    createdAt: '2022-12-16T18:13:41.339+0000',
    updatedAt: '2022-12-16T18:13:41.339+0000',
    connect: {
      formAction: {
        installEndpoint: '/business/{businessId}/integration-wrapper/credit_card/install',
        uninstallEndpoint: '/business/{businessId}/integration-wrapper/credit_card/uninstall',
      },
    },
    installationOptions: {
      links: [
        {
          _id: '7150debe-0651-4e63-8e53-4ecc4241146c',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/credit-card.png`,
        },
      ],
    },
  },
  // openbank
  {
    _id: '880e5eba-7bb2-43d4-9de6-104a4cfe20c1',
    wrapperType: 'openbank',
    displayOptions: {
      _id: '180e5eba-7bb2-43d4-9de6-104a4cfe20c1',
      icon: '#icon-payment-option-openbank',
      title: 'integrations.payments.openbank.title',
      bgColor: '#59AFF9-#6755FF',
    },
    optionIcon: '#icon-payment-option-openbank',
    category: 'integrations.payments.openbank.category',
    developer: 'integrations.payments.openbank.developer',
    languages: 'integrations.payments.openbank.languages',
    description: 'integrations.payments.openbank.description',
    createdAt: '2022-12-16T18:13:41.339+0000',
    updatedAt: '2022-12-16T18:13:41.339+0000',
    connect: {
      formAction: {
        installEndpoint: '/business/{businessId}/integration-wrapper/openbank/install',
        uninstallEndpoint: '/business/{businessId}/integration-wrapper/openbank/uninstall',
      },
    },
    installationOptions: {
      links: [
        {
          _id: '8150debe-0651-4e63-8e53-4ecc4241146d',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/payments/openbank.png`,
        },
      ],
    },
  },
];
