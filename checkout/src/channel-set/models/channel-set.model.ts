import { Document } from 'mongoose';
import { CheckoutModel } from '../../checkout';
import { ChannelSetInterface } from '../interfaces';

export interface ChannelSetModel extends ChannelSetInterface, Document {
  checkout: CheckoutModel;
}
