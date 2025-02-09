import { 
  partialFactory,
  PartialFactory, 
  DefaultFactory, 
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';
import { businessProductDefaultFactory } from './business-product.factory';

export const channelSetLastSoldProductListDefaultFactory: DefaultFactory<any> = (): any => ({
  _id: v4(),
  products: [
    [...Array(5).keys()].map(businessProductDefaultFactory),
  ],
});

export const channelSetLastSoldProductListFactory: PartialFactory<any> 
  = partialFactory<any>(channelSetLastSoldProductListDefaultFactory);
