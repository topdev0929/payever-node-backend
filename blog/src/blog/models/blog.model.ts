import { ChannelSetModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { BlogInterface } from '../interfaces';

export interface BlogModel extends BlogInterface, Document {
  channelSet: ChannelSetModel;
  business?: BusinessModel;
}
