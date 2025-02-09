import { Document } from 'mongoose';
import { ChannelSetInterface } from '../../../statistics/interfaces';
import { ChannelSetProductAggregateInterface } from '../interfaces';

export interface ChannelSetProductAggregateModel extends ChannelSetProductAggregateInterface, Document {
  channelSet: ChannelSetInterface;
}
