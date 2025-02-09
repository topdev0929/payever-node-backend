import * as uuid from 'uuid';

import { ProductSettingsInterface } from '../../../src/products/interfaces/product-settings.interface';
import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';

const defaultProductSettings: any = (): ProductSettingsInterface => ({
  businessId: [uuid.v4()],
  settings: {
    currency: 'USD',
    measureMass: '',
    measureSize: '',
    welcomeShown: false,
  },
});

export const productSettingsFactory: PartialFactory<ProductSettingsInterface> = partialFactory(defaultProductSettings);
