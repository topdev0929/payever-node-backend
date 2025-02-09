import { Document } from 'mongoose';
import { ChannelSetInterface } from '../interfaces';
import { BusinessModel } from '../models';

export interface ChannelSetModel extends ChannelSetInterface, Document {
  business?: BusinessModel;
}
