import { 
  partialFactory, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';
import { channelSetProductDefaultFactory } from './channel-set-product.factory';

export const businessLastSoldProductListDefaultFactory: DefaultFactory<any> = (): any => ({
  _id: v4(),
  products: [
    [...Array(5).keys()].map(channelSetProductDefaultFactory),
  ],
});

export const businessLastSoldProductListFactory: PartialFactory<any> 
  = partialFactory<any>(businessLastSoldProductListDefaultFactory);
