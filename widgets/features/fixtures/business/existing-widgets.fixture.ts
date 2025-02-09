import { combineFixtures, fixture, BaseFixture } from '@pe/cucumber-sdk';
import { Type } from '@nestjs/common';

import { WidgetInstallationModel, WidgetModel } from '../../../src/widget';
import { userFactory, widgetFactory } from '../factories';
import { BusinessModel } from '../../../src/business/models';
import { businessFactory } from '../factories/business.factory';
import { UserModel } from '../../../src/user/models';
import { widgetInstallFactory } from '../factories/widget-installation.factory';

const businessFixture: Type<BaseFixture> = fixture<BusinessModel>('BusinessModel', businessFactory, [
  {
    _id: '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
    installations: [
      '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
      '3b8e9196-ccaa-4863-8f1e-19c18f2e4b90',
    ],
  },
]);

const widgetFixture: Type<BaseFixture> =
fixture<WidgetInstallationModel>('WidgetInstallationModel', widgetInstallFactory, [
  {
    _id: '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
    widget: 'e62b4849-b946-49ce-b863-7bcb7e8b978c',
  },
  {
    _id: '3b8e9196-ccaa-4863-8f1e-19c18f2e4b90',
    widget: 'e62b4849-b946-49ce-b863-7bcb7e8b978d',
  },
]);

export = combineFixtures(businessFixture, widgetFixture,
                         fixture<UserModel>('UserModel', userFactory, [
    {
      _id: 'f07c5841-2ec5-419b-95ed-2583b1ae0b84',
      installations: [
        '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
        '3b8e9196-ccaa-4863-8f1e-19c18f2e4b90',
      ],
    },
  ]),
                         fixture<WidgetModel>('WidgetModel', widgetFactory, [
  {
    _id: '25e394f9-a596-4410-9403-4d111420b1c8',
    installByDefault: false,
    title: 'Checkout',
    type: 'checkout',
  },
  {
    _id: '358ada94-6559-4f92-9cdc-077ea46bc3d7',
    installByDefault: false,
    title: 'Point Of Sale',
    type: 'pos',
  },
  {
    _id: 'e62b4849-b946-49ce-b863-7bcb7e8b978b',
    installByDefault: false,
    title: 'Connect',
    type: 'connect',
  },
  {
    _id: 'e62b4849-b946-49ce-b863-7bcb7e8b978c',
    installByDefault: false,
    title: 'Settings',
    type: 'settings',
  },
  {
    _id: 'e62b4849-b946-49ce-b863-7bcb7e8b978d',
    installByDefault: false,
    title: 'Transactions',
    type: 'transactions',
  },
  {
    _id: '00e42593-2b79-4f29-82e0-9175c80b263f',
    installByDefault: true,
    title: 'Apps',
    type: 'apps',
  },
]));
