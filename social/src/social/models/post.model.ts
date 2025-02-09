import { BusinessLocalModel } from '../../business';
import { ChannelSetModel } from '../../channel-set';
import { PostInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface PostModel extends Document, PostInterface {
  business?: BusinessLocalModel;
  channelSet: ChannelSetModel[] | string[];
  updatedAt?: Date;
  createdAt?: Date;
}
