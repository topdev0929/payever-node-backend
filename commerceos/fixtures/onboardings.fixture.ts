// tslint:disable:no-duplicate-string
// tslint:disable-next-line: no-commented-code
// tslint:disable: trailing-comma
// tslint:disable: object-literal-sort-keys
import { OnboardingDto } from '../src/onboarding/dto';
import { environment } from '../src/environments';
import { FormFieldTypeEnum, OnboardingTypeEnum, RegisterStep } from '../src/onboarding/enums';
import { SetupStatusEnum } from '../src/apps/enums/setup-status.dto';

const ONBOARDING_IMAGES_URL: string = `${environment.microUrlCustomCdn}/images`;

export const defaultApps: any[] = [
  {
    app: '79cee30b-92a7-4796-a152-6303a4117d7f',
    code: 'checkout',
    installed: true,
    order: 50,
  },
  {
    app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
    code: 'connect',
    installed: true,
  },
  {
    app: '0b923041-e8f1-4531-9430-d2d593043e29',
    code: 'message',
    installed: true,
    order: 130,
  },
  {
    app: 'c4094635-0f1d-42ed-b059-9a5a0dc9b5bb',
    code: 'products',
    installed: true,
    order: 30,
  },
  {
    app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
    code: 'settings',
    installed: true,
    order: 20,
  },
  {
    app: '51cce2bb-5a89-4442-a1cc-c6eed25c614a',
    code: 'shop',
    installed: true,
    order: 90,
  },
  {
    app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
    code: 'transactions',
    installed: true,
    order: 10,
  },
];

export const businessApps: any[] = [
  {
    app: '79cee30b-92a7-4796-a152-6303a4117d7f',
    code: 'checkout',
    installed: true,
    order: 50,
  },
  {
    app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
    code: 'connect',
    installed: true,
  },
  {
    app: 'c4094635-0f1d-42ed-b059-9a5a0dc9b5bb',
    code: 'products',
    installed: true,
    order: 30,
  },
  {
    app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
    code: 'settings',
    installed: true,
    order: 20,
  },
  {
    installed: true,
    app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
    code: 'pos',
    order: 120,
  },
  {
    app: '51cce2bb-5a89-4442-a1cc-c6eed25c614a',
    code: 'shop',
    installed: true,
    order: 90,
  },
  {
    app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
    code: 'transactions',
    installed: true,
    order: 10,
  },
];

export const industryApps: any[] = [
  {
    installed: true,
    app: '79cee30b-92a7-4796-a152-6303a4117d7f',
    code: 'checkout',
    order: 50,
  },
  {
    installed: true,
    app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
    code: 'connect',
  },
  {
    installed: true,
    app: 'c4094635-0f1d-42ed-b059-9a5a0dc9b5bb',
    code: 'products',
    order: 30,
  },
  {
    installed: true,
    app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
    code: 'transactions',
    order: 10,
  },
  {
    installed: true,
    app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
    code: 'pos',
    order: 120,
  },
  {
    installed: true,
    app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
    code: 'settings',
    order: 20,
  },
  {
    installed: true,
    app: '51cce2bb-5a89-4442-a1cc-c6eed25c614a',
    code: 'shop',
    order: 90,
  },

  // TODO: hidden for now
  // {
  //   installed: true,
  //   app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
  //   code: 'commerceos',
  // },
  // {
  //   installed: true,
  //   app: '5984444f-309f-4b53-9612-a51158b3acef',
  //   code: 'coupons',
  //   order: 60,
  // },
  // {
  //   installed: true,
  //   app: '44752e00-5bf1-4406-a744-5e8778406ac5',
  //   code: 'invoice',
  // },
  // {
  //   installed: true,
  //   app: '5096b957-e418-48ff-9404-79789320efbf',
  //   code: 'blog',
  // },
  // {
  //   installed: true,
  //   app: 'ec1918b2-2945-4db9-8ff1-851a47d744b1',
  //   code: 'site',
  //   order: 110,
  // },
  // {
  //   installed: true,
  //   app: '5df5a2d8-d2ff-4cdd-8613-3af8a3c31c66',
  //   code: 'studio',
  //   order: 70,
  // },
  // {
  //   installed: true,
  //   app: '93460865-c128-4e44-bceb-64316a4bd05c',
  //   code: 'shipping',
  //   order: 80,
  // },
  // {
  //   installed: true,
  //   app: '97ff306c-ce86-4826-bda8-e5bdf2f5bdad',
  //   code: 'appointments',
  // },
  // {
  //   installed: true,
  //   app: '2d259dfb-02f1-4133-8962-0fdb19f601dd',
  //   code: 'subscriptions',
  // },
  // {
  //   installed: true,
  //   app: '54f6f8d4-55ff-419a-925e-4dd601648c63',
  //   code: 'social',
  // },
  // {
  //   installed: true,
  //   app: '1112a982-7ad4-4b03-8d53-874797f1c795',
  //   code: 'affiliates',
  // },
];

export const paymentApps: any[] = [
  {
    code: 'api',
    installed: true,
  },
  {
    code: 'santander_invoice_de',
    installed: true,
  },
  {
    code: 'santander_installment_no',
    installed: true,
  },
  {
    code: 'santander_ccp_installment',
    installed: true,
  },
  {
    code: 'santander_factoring_de',
    installed: true,
  },
  {
    code: 'santander_pos_factoring_de',
    installed: true,
  },
  {
    code: 'santander_pos_installment_se',
    installed: true,
  },
  {
    code: 'santander_installment_nl',
    installed: true,
  },
  {
    code: 'santander_installment_at',
    installed: true,
  },
  {
    code: 'santander_invoice_no',
    installed: true,
  },
  {
    code: 'santander_pos_invoice_de',
    installed: true,
  },
  {
    code: 'santander_installment_dk',
    installed: true,
  },
  {
    code: 'santander_pos_installment_fi',
    installed: true,
  },
  {
    code: 'santander_installment_fi',
    installed: true,
  },
  {
    code: 'santander_pos_installment_no',
    installed: true,
  },
  {
    code: 'santander_pos_installment_dk',
    installed: true,
  },
  {
    code: 'santander_pos_installment_uk',
    installed: true,
  },
  {
    code: 'santander_installment',
    installed: true,
  },
  {
    code: 'santander_installment_uk',
    installed: true,
  },
  {
    code: 'santander_pos_installment',
    installed: true,
  },
  {
    code: 'santander_installment_se',
    installed: true,
  },
];

export const onboardings: OnboardingDto[] = [
  // Default
  {
    _id: 'c77eb766-6dbf-49c2-9aed-f8bae410067e',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: industryApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-{onboardingName}',
    name: 'industry',
    type: OnboardingTypeEnum.Industry,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-{onboardingName}.jpg`,
  },
  // Business
  {
    _id: '84023fa5-4710-4db5-b7eb-6962a730e38b',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: businessApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-commerceos-payever-entry-logo',
    name: 'business',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-background.jpg`,
  },
  // Trial
  {
    _id: 'ab5f1ddc-33a4-45f3-9bdd-519e734e57c3',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: businessApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-commerceos-payever-entry-logo',
    name: 'trial',
    type: OnboardingTypeEnum.Trial,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-background.jpg`,
  },
  // Partners
  {
    _id: '79087d15-217e-466d-9a69-2beb5d7fcc89',
    afterLogin: [
      {
        method: 'PATCH',
        name: 'install-facebook',
        orderId: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlConnect}/business/:businessId/integration/facebook/install`,
      },
      {
        method: 'POST',
        name: 'pre-install-facebook',
        orderId: 1,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlThirdPartyProducts}/business/:businessId/integration/facebook/pre-install`,
      },
    ],
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: defaultApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
      {
        method: 'PATCH',
        name: 'install-facebook',
        orderId: 1,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlConnect}/business/:businessId/integration/facebook/install`,
      },
      {
        method: 'POST',
        name: 'pre-install-facebook',
        orderId: 2,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlThirdPartyProducts}/business/:businessId/integration/facebook/pre-install`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-facebook',
    name: 'facebook',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-facebook.jpg`,
  },
  {
    _id: '670aae49-10d5-4eb9-a9f4-a3e6f326cc0c',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: defaultApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-bmo-harris',
    name: 'bmo-harris',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-bmo-harris.jpg`,
  },
  {
    _id: 'd6121871-090c-4a27-9a5e-81075c9d812f',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
            code: 'pos',
            order: 120,
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            app: 'c4094635-0f1d-42ed-b059-9a5a0dc9b5bb',
            code: 'products',
            installed: true,
            order: 30,
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    form: [
      {
        name: 'companyDetails.businessStatus',
        placeholder: 'forms.registration.name.placeholder',
        required: true,
        title: 'forms.business_create.businessStatus.label',
        type: FormFieldTypeEnum.SelectBusinessStatus,
        values: [],
      },
      {
        name: 'name',
        placeholder: 'forms.business_create.name.placeholder',
        required: true,
        title: 'forms.business_create.name.placeholder',
        type: FormFieldTypeEnum.Text,
      },
      {
        name: 'companyDetails.status',
        placeholder: 'forms.business_create.status.label',
        required: true,
        title: 'forms.business_create.status.label',
        type: FormFieldTypeEnum.SelectStatus,
        values: [],
      },
      {
        name: 'salesRange',
        placeholder: 'forms.business_create.sales.label',
        required: true,
        title: 'forms.business_create.sales.label',
        type: FormFieldTypeEnum.SelectSales,
        values: [],
      },
      {
        name: 'companyDetails.industry',
        placeholder: 'forms.business_create.industry.placeholder',
        relativeField: 'companyDetails.product',
        required: true,
        title: 'forms.business_create.industry.placeholder',
        type: FormFieldTypeEnum.Autocomplete,
        values: [],
      },
      {
        name: 'companyDetails.product',
        placeholder: 'product',
        required: true,
        title: 'product',
        type: FormFieldTypeEnum.Hidden,
      },
      {
        name: 'companyAddress.country',
        placeholder: 'forms.business_create.countryPhoneCode.label',
        required: true,
        title: 'forms.business_create.countryPhoneCode.label',
        type: FormFieldTypeEnum.SelectPhoneCode,
        values: [],
      },
      {
        name: 'contactDetails.phone',
        placeholder: 'forms.business_create.phoneNumber.label',
        required: true,
        title: 'forms.business_create.phoneNumber.label',
        type: FormFieldTypeEnum.Phone,
      },
      {
        name: 'taxes.taxId',
        placeholder: 'forms.registration.tax-id.placeholder',
        required: true,
        title: 'forms.registration.tax-id.label',
        type: FormFieldTypeEnum.Text,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-santander',
    name: 'santander',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-santander.jpg`,
  },
  {
    _id: 'de2db1d4-a86b-48b3-af8e-6ae7e6ab86bc',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
            code: 'pos',
            order: 120,
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
      {
        method: 'PATCH',
        name: 'update-checkout-settings',
        orderId: 1,
        payload: {
          logo: '',
          settings: {
            businessType: 'b2c',
            cspAllowedHosts: [],
            testingMode: false,
            languages: [
              {
                active: false,
                isDefault: false,
                code: 'no',
                name: 'Norsk',
                _id: '2ae3afaf-77a7-4788-961e-44bb05c7ad6f'
              },
              {
                active: false,
                isDefault: false,
                code: 'sv',
                name: 'Svenska',
                _id: '60bb8b13-ca1e-45fc-87e3-e24ea4f24c7c'
              },
              {
                active: false,
                isDefault: false,
                code: 'de',
                name: 'Deutsch',
                _id: '7cca4d40-0ac6-464f-9321-39f89ccb5f12'
              },
              {
                active: true,
                isDefault: true,
                code: 'en',
                name: 'English',
                _id: 'dba8382b-4b3f-4bca-ab16-104d941a36e8'
              },
              {
                active: false,
                isDefault: false,
                code: 'es',
                name: 'Español',
                _id: '36516493-93cd-487f-98f1-d6d78d45fd1a'
              },
              {
                active: false,
                isDefault: false,
                code: 'da',
                name: 'Dansk',
                _id: '3d5130c7-7329-443a-89c0-4303cca2c70b'
              }
            ]
          }
        },
        priority: 1,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCheckout}/business/:businessId/checkout/default/settings`,
      },
      {
        method: 'PATCH',
        name: 'update-checkout-sections',
        orderId: 2,
        payload: {
          sections: [
            {
              code: 'address',
              enabled: true,
              order: 1
            },
            {
              code: 'choosePayment',
              enabled: true,
              order: 2
            },
            {
              code: 'payment',
              enabled: true,
              order: 3
            },
            {
              code: 'user',
              enabled: false,
              order: 4
            }
          ]
        },
        priority: 2,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCheckout}/business/:businessId/checkout/default/sections`
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-zinia',
    name: 'zinia',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-zinia.jpg`,
  },
  {
    _id: 'e47259ff-fdbb-4c47-9350-5ce537e75313',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: defaultApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-opel',
    name: 'opel',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-opel.jpg`,
  },
  {
    _id: 'f0163d74-bef8-46a1-8fc4-95ce6086a704',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: defaultApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-finovate',
    name: 'finovate',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-finovate.jpg`,
  },
  // Industries
  {
    _id: '0af524ca-a9c6-4a86-b723-d25d0c6bdd06',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: industryApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
      {
        method: 'PATCH',
        name: 'install-personal-apps',
        orderId: 1,
        payload: {
          installed: true,
          setupStatus: SetupStatusEnum.NotStarted,
        },
        registerSteps: [RegisterStep.account],
        url: `${environment.microUrlCommerceOS}/apps/user/toggle-installed/0b923041-e8f1-4531-9430-d2d593043e29`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-fashion',
    name: 'fashion',
    type: OnboardingTypeEnum.Industry,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-fashion.jpg`,
  },
  {
    _id: 'c14a23fe-5146-45b4-898f-c66694e12589',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: industryApps,
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
      {
        method: 'PATCH',
        name: 'install-personal-apps',
        orderId: 1,
        payload: {
          installed: true,
          setupStatus: SetupStatusEnum.NotStarted,
        },
        registerSteps: [RegisterStep.account],
        url: `${environment.microUrlCommerceOS}/apps/user/toggle-installed/0b923041-e8f1-4531-9430-d2d593043e29`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-coaching',
    name: 'coaching',
    type: OnboardingTypeEnum.Industry,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-coaching.jpg`,
  },
  {
    _id: 'bef923f5-9c83-4c38-80ac-6fd247b7bd06',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [
            {
              installed: true,
              app: '79cee30b-92a7-4796-a152-6303a4117d7f',
              code: 'checkout',
            },
            {
              installed: true,
              app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
              code: 'connect',
            },
            {
              installed: true,
              app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
              code: 'pos',
            },
            {
              app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
              code: 'transactions',
              installed: true,
            },
            {
              installed: true,
              app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
              code: 'settings',
            },
            {
              installed: true,
              app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
              code: 'commerceos',
            },
          ],
        },
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-optadata',
    name: 'optadata',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-optadata`,
  },
  {
    _id: 'bd00df49-ba61-41c9-834d-3023fa3fac22',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-swedbank',
    name: 'swedbank',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-swedbank.jpg`,
  },
  {
    _id: '9ab45999-e14e-4cf5-82a2-dc6a75739502',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-paypal',
    name: 'paypal',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-paypal.jpg`,
  },
  {
    _id: '3e74184d-fd59-4099-9878-318ad595a324',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-instant-payment',
    name: 'instant-payment',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-instant-payment.jpg`,
  },
  {
    _id: 'd1907d47-5ab9-49d5-ac4f-29e9bc42a57b',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-sofort',
    name: 'sofort',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-sofort.jpg`,
  },
  {
    _id: 'ae9ae05d-a2c1-4bf4-9373-1d47c0759598',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-stripe',
    name: 'stripe',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-stripe.jpg`,
  },
  {
    _id: '14a03c97-0b38-4241-a780-d12ff10b7732',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-cash',
    name: 'cash',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-cash.jpg`,
  },
  {
    _id: 'c49a0439-4d4e-4eb4-979b-2064006cebb3',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-apple-pay',
    name: 'apple-pay',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-apple-pay.jpg`,
  },
  {
    _id: '64d7f184-f2d6-49a1-ab3a-46b296c84b86',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-google-pay',
    name: 'google-pay',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-google-pay.jpg`,
  },
  {
    _id: '4a8cc1ca-1b2c-46ba-9091-dc7ef886011b',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
    ],
    defaultLoginByEmail: true,
    logo: '#icon-industries-payex',
    name: 'payex',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-payex.jpg`,
  },

  {
    _id: '3848f420-b268-47a8-9b91-610b1ab4c2ae',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
            code: 'pos',
            order: 120,
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },

      {
        method: 'PATCH',
        name: 'refresh-token',
        orderId: 1,
        payload: {},
        priority: 1,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
      },
      {
        method: 'PATCH',
        name: 'install-santander-pos-installment',
        orderId: 2,
        payload: {},
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlConnect}/business/:businessId/integration/santander_pos_installment/install`,
      },
      {
        method: 'PATCH',
        name: 'update-checkout-settings',
        orderId: 1,
        payload: {
          sections: [
            {
              code: 'choosePayment',
              enabled: true,
              order: 1,
            },
            {
              code: 'address',
              enabled: true,
              order: 2,
            },
            {
              code: 'payment',
              enabled: true,
              order: 3,
            },
            {
              code: 'user',
              enabled: false,
              order: 4,
            },
          ],
        },
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlCheckout}/business/:businessId/checkout/default/sections`,
      },
      {
        method: 'POST',
        name: 'set-default-wallpaper',
        orderId: 3,
        payload: {
          wallpaper: '1c347aff-4157-43fd-9ae8-3cd9e79d36f8-commerceos-industry-background-business-pos.jpg',
          theme: 'default',
        },
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlWallpapers}/business/:businessId/wallpapers/active`,
      },
    ],
    defaultLoginByEmail: true,
    defaultBusinessWallpaper: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-business-pos.jpg`,
    form: [
      {
        name: 'companyDetails.businessStatus',
        placeholder: 'forms.registration.name.placeholder',
        required: true,
        title: 'forms.business_create.businessStatus.label',
        type: FormFieldTypeEnum.SelectBusinessStatus,
        values: [],
      },
      {
        name: 'name',
        placeholder: 'forms.business_create.name.placeholder',
        required: true,
        title: 'forms.business_create.name.placeholder',
        type: FormFieldTypeEnum.Text,
      },
      {
        name: 'companyDetails.status',
        placeholder: 'forms.business_create.status.label',
        required: true,
        title: 'forms.business_create.status.label',
        type: FormFieldTypeEnum.SelectStatus,
        values: [],
      },
      {
        name: 'salesRange',
        placeholder: 'forms.business_create.sales.label',
        required: true,
        title: 'forms.business_create.sales.label',
        type: FormFieldTypeEnum.SelectSales,
        values: [],
      },
      {
        name: 'companyDetails.industry',
        placeholder: 'forms.business_create.industry.placeholder',
        relativeField: 'companyDetails.product',
        required: true,
        title: 'forms.business_create.industry.placeholder',
        type: FormFieldTypeEnum.Autocomplete,
        values: [],
      },
      {
        name: 'companyDetails.product',
        placeholder: 'product',
        required: true,
        title: 'product',
        type: FormFieldTypeEnum.Hidden,
      },
      {
        name: 'companyAddress.country',
        placeholder: 'forms.business_create.countryPhoneCode.label',
        required: true,
        title: 'forms.business_create.countryPhoneCode.label',
        type: FormFieldTypeEnum.SelectPhoneCode,
        values: [],
      },
      {
        name: 'contactDetails.phone',
        placeholder: 'forms.business_create.phoneNumber.label',
        required: true,
        title: 'forms.business_create.phoneNumber.label',
        type: FormFieldTypeEnum.Phone,
      },
      {
        name: 'taxes.taxId',
        placeholder: 'forms.registration.tax-id.placeholder',
        required: true,
        title: 'forms.registration.tax-id.label',
        type: FormFieldTypeEnum.Text,
      },
    ],
    logo: '#icon-industries-santander',
    name: 'santander-de-pos-installment',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-pos.jpg`,
  },
  {
    _id: '3848f420-b268-47a8-9b91-610b1ab4c2af',
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'install-apps',
        orderId: 0,
        payload: {
          apps: [{
            installed: true,
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            order: 50,
          }, {
            installed: true,
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
          }, {
            installed: true,
            app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
            code: 'pos',
            order: 120,
          }, {
            installed: true,
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            order: 10,
          }, {
            installed: true,
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            order: 20,
          }, {
            installed: true,
            app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
            code: 'commerceos',
          }],
        },
        priority: 0,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },

      {
        method: 'PATCH',
        name: 'refresh-token',
        orderId: 1,
        payload: {},
        priority: 1,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
      },
      {
        method: 'PATCH',
        name: 'install-santander-uk-installment',
        orderId: 2,
        payload: {},
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlConnect}/business/:businessId/integration/santander_installment_uk/install`,
      },
      {
        method: 'PATCH',
        name: 'install-santander-pos-uk-installment',
        orderId: 2,
        payload: {},
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlConnect}/business/:businessId/integration/santander_pos_installment_uk/install`,
      },
      {
        method: 'PATCH',
        name: 'install-qr',
        orderId: 2,
        payload: {},
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlConnect}/business/:businessId/integration/qr/install`,
      },
      {
        method: 'PATCH',
        name: 'update-checkout-settings',
        orderId: 1,
        payload: {
          sections: [
            {
              code: 'choosePayment',
              enabled: true,
              order: 1,
            },
            {
              code: 'address',
              enabled: true,
              order: 2,
            },
            {
              code: 'payment',
              enabled: true,
              order: 3,
            },
            {
              code: 'user',
              enabled: false,
              order: 4,
            },
          ],
        },
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlCheckout}/business/:businessId/checkout/default/sections`,
      },
      {
        method: 'PATCH',
        name: 'change-settings',
        orderId: 4,
        payload: {
          defaultLanguage: 'en',
          currency: 'GBP',
          themeSettings: {
            theme: 'default',
            _id: '71dcee04-436a-46b8-a921-1ace2cca39c9',
          },
          businessDetail: {
            themeSettings: {
              theme: 'default',
            },
            defaultLanguage: 'en',
          },
        },
        priority: 4,
        registerSteps: ['business'],
        url: `${environment.microUrlUser}/business/:businessId`,
      },
      {
        method: 'POST',
        name: 'set-default-wallpaper',
        orderId: 3,
        payload: {
          wallpaper: 'd3e2ea58-26ad-487a-be53-4a7b280517a6-commerceos-industry-background-uk-dashboard.jpg',
          theme: 'default',
        },
        priority: 2,
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlWallpapers}/business/:businessId/wallpapers/active`,
      },
    ],
    defaultLoginByEmail: true,
    defaultBusinessWallpaper: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-uk-registration.jpg`,
    form: [],
    logo: '#icon-industries-santander',
    name: 'santander-gb-installment',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl: `${ONBOARDING_IMAGES_URL}/commerceos-industry-background-uk-registration.jpg`,
  },
  {
    _id: '7987eec4-fe2b-4eb8-b55c-299b6a5206de',
    afterLogin: [
      {
        method: 'PATCH',
        name: 'refresh-token',
        orderId: 1,
        priority: 1,
        payload: {},
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
      },
      {
        method: 'GET',
        name: 'check-is-app-installed',
        orderId: 3,
        priority: 3,
        registerSteps: [
          'business',
        ],
        capture: {
          installed: 'installed'
        },
        url: `${environment.microUrlConnect}/business/:businessId/integration/:integration`,
      },
      {
        method: 'PATCH',
        name: 'install-app',
        ifTrue: ':installed != true',
        orderId: 4,
        priority: 4,
        payload: {},
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlConnect}/business/:businessId/integration/:integration/install`,
      },
      {
        method: 'GET',
        name: 'get-api-keys',
        orderId: 5,
        priority: 5,
        capture: {
          credentialsCount: 'length',
          clientId: '[0]',
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlPlugins}/business/:businessId/shopsystem/type/:integration/api-key`,
      },
      {
        method: 'POST',
        name: 'create-credentials',
        orderId: 6,
        priority: 6,
        ifTrue: ':credentialsCount == 0',
        payload: {
          name: 'Default'
        },
        capture: {
          clientId: '_id'
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/oauth/:businessId/clients`,
      },
      {
        method: 'POST',
        name: 'link-credentials',
        ifTrue: ':credentialsCount == 0',
        orderId: 7,
        priority: 7,
        payload: {
          id: ':clientId'
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlPlugins}/business/:businessId/shopsystem/type/:integration/api-key`,
      },
      {
        method: 'GET',
        name: 'get-business-name',
        orderId: 8,
        priority: 8,
        capture: {
          businessName: 'name',
        },
        registerSteps: [
          'business'
        ],
        url: `${environment.microUrlUser}/business/:businessId`,
      },
      {
        method: 'GET',
        name: 'get-credentials',
        orderId: 9,
        priority: 9,
        capture: {
          clientId: '[0].id',
          clientSecret: '[0].secret'
        },
        returns: {
          clientId: ':clientId',
          clientSecret: ':clientSecret',
          businessId: ':businessId',
          businessName: ':businessName',
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/oauth/:businessId/clients?clients%5B%5D=:clientId`,
      },
    ],
    afterRegistration: [
      {
        method: 'PATCH',
        name: 'refresh-token',
        orderId: 0,
        priority: 0,
        payload: {},
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
      },
      {
        registerSteps: ['business'],
        method: 'PATCH',
        name: 'install-apps',
        orderId: 1,
        payload: {
          apps: [
            {
              installed: true,
              app: '79cee30b-92a7-4796-a152-6303a4117d7f',
              code: 'checkout',
              order: 50,
            },
            {
              installed: true,
              app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
              code: 'connect',
            },
            {
              installed: true,
              app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
              code: 'settings',
              order: 20,
            },
            {
              installed: true,
              app: 'b792a6b5-2218-43fa-ade4-3548518ee0ba',
              code: 'commerceos',
            },
          ],
        },
        priority: 1,
        url: `${environment.microUrlCommerceOS}/apps/business/:businessId/toggle-installed`,
      },
      {
        method: 'PATCH',
        name: 'refresh-token',
        orderId: 2,
        priority: 2,
        payload: {},
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
      },
      {
        method: 'PATCH',
        name: 'install-app',
        orderId: 3,
        priority: 3,
        payload: {},
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlConnect}/business/:businessId/integration/:integration/install`,
      },
      {
        method: 'POST',
        name: 'create-credentials',
        orderId: 4,
        priority: 4,
        payload: {
          name: 'Default'
        },
        capture: {
          clientId: 'id',
          clientSecret: 'secret'
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/oauth/:businessId/clients`,
      },
      {
        method: 'POST',
        name: 'link-credentials',
        orderId: 5,
        priority: 5,
        payload: {
          id: ':clientId'
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlPlugins}/business/:businessId/shopsystem/type/:integration/api-key`,
      },
      {
        method: 'GET',
        name: 'get-business-name',
        orderId: 6,
        priority: 6,
        capture: {
          businessName: 'name',
        },
        registerSteps: [
          'business'
        ],
        url: `${environment.microUrlUser}/business/:businessId`,
      },
      {
        method: 'GET',
        name: 'get-credentials',
        orderId: 7,
        priority: 7,
        capture: {
          clientId: '[0].id',
          clientSecret: '[0].secret'
        },
        returns: {
          clientId: ':clientId',
          clientSecret: ':clientSecret',
          businessName: ':businessName',
          businessId: ':businessId',
        },
        registerSteps: [
          'business',
        ],
        url: `${environment.microUrlAuth}/oauth/:businessId/clients?clients%5B%5D=:clientId`,
      },
    ],
    defaultLoginByEmail: true,
    defaultBusinessWallpaper: '',
    form: [],
    logo: '#icon-commerceos-payever-entry-logo',
    name: 'plugin',
    type: OnboardingTypeEnum.Partner,
    wallpaperUrl:
      'https://cdn.staging.devpayever.com/images/commerceos-background.jpg',
  },
];
