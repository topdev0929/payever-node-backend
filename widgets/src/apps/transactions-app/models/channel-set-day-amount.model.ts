import { Document } from 'mongoose';
import { ChannelSetModel } from '../../../statistics';
import { ChannelSetDateRevenueInterface } from '../interfaces';

export interface ChannelSetDayAmountModel extends ChannelSetDateRevenueInterface, Document {
  channelSet: ChannelSetModel;
}
