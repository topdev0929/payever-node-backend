import { Document, Types } from 'mongoose';
import { ChannelSetModel } from '../../channel-set';
import { CheckoutModel } from '../../checkout';
import { BusinessInterface } from '../interfaces';
import { BusinessDetailModel } from './business-detail.model';

export interface BusinessModel extends BusinessInterface, Document {
  readonly channelSets: Types.DocumentArray<ChannelSetModel> | string[];
  readonly checkouts: Types.DocumentArray<CheckoutModel> | string[];
  readonly businessDetail?: BusinessDetailModel;
}
