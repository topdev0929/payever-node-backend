import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';

import { ProductInterface } from '../../src/products/interfaces';

const defaultFactory: () => any = () => ({ });

export const productsFactory: PartialFactory<ProductInterface> = partialFactory(defaultFactory);
