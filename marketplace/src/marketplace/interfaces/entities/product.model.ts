import { Document } from 'mongoose';

import { ChannelSetModel } from '@pe/channels-sdk';
import { ProductInterface } from './product.interface';
import { BusinessModel } from './business.model';

export interface ProductModel extends ProductInterface, Document {
  business?: BusinessModel;
  channelSet: ChannelSetModel;
}
