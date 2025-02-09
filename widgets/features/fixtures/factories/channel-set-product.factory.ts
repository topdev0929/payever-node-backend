import { 
  partialFactory,
  PartialFactory, 
  DefaultFactory, 
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';
import { productDefaultFactory } from './product-factory';

export const channelSetProductDefaultFactory: DefaultFactory<any> = (): any => {
  return ({
    ...productDefaultFactory(),
    channelSet: v4(),
  });
};

export const channelSetProductFactory: PartialFactory<any> = partialFactory<any>(channelSetProductDefaultFactory);
