import {
  partialFactory,
  PartialFactory,
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

import { productDefaultFactory } from './product-factory';

export const businessProductDefaultFactory: DefaultFactory<any> = (): any => {
  return ({
    ...productDefaultFactory(),
    businessId: v4(),
  });
};

export const businessProductFactory: PartialFactory<any> = partialFactory<any>(businessProductDefaultFactory);
