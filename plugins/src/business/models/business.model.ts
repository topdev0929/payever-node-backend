import { ChannelAwareBusinessModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { ShopSystemModel } from '../../plugin/models';

import { BusinessInterface } from '../interfaces';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
  readonly shopSystems: Types.DocumentArray<ShopSystemModel>;
}
