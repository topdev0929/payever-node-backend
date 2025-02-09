import { fixture } from '@pe/cucumber-sdk';
import { ProductCountrySettingModel } from '../../../../src/products/models';
import { productCountrySettingFactory } from '../../factories';

const productId: string = 'bd49e195-26c1-4fbc-b95d-31996966cfae';

export = fixture<ProductCountrySettingModel>('ProductCountrySettingModel', productCountrySettingFactory, [
  {
    product: productId,
  },
]);
