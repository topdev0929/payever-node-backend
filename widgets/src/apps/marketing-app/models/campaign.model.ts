import { Document } from 'mongoose';
import { ChannelSetModel } from '../../../statistics/models';
import { CampaignInterface } from '../interfaces';

export interface CampaignModel extends CampaignInterface, Document {
  _id?: string;
  id?: string;
  channelSet: ChannelSetModel | string;
}
