import { fixture } from '@pe/cucumber-sdk';
import { productSettingsFactory } from '../../factories/product-settings.factory';
import { ProductSettingsModel } from '../../../../src/products/models';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

export = fixture<ProductSettingsModel>('ProductSettingsModel', productSettingsFactory, [
  {
    businessIds: [someBusinessId],
  },
  {
    businessIds: [someOtherBusinessId],
    settings: {
      currency: 'EUR',
      welcomeShown: true,
    },
  },
]);
