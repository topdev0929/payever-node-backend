import { ChannelSetModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { CommentInterface } from '../interfaces';

export interface CommentModel extends CommentInterface, Document {
  channelSet: ChannelSetModel;
  business?: BusinessModel;
}
