import { fixture } from '@pe/cucumber-sdk';
import { ProductTranslationModel } from '../../../../src/products/models';
import { productTranslationFactory } from '../../factories';

const productId: string = 'bd49e195-26c1-4fbc-b95d-31996966cfae';

export = fixture<ProductTranslationModel>('ProductTranslationModel', productTranslationFactory, [
  {
    product: productId,
  },
]);
