import { Document } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { ChannelSetInterface } from '../interfaces';

export interface ChannelSetModel extends ChannelSetInterface, Document {
  business?: BusinessModel;
}
