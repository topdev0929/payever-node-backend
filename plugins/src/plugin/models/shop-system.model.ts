import { ChannelModel, ChannelSetModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { ShopSystemInterface } from '../interfaces';

export interface ShopSystemModel extends ShopSystemInterface, Document {
  readonly channel: ChannelModel;
  readonly channelSet: ChannelSetModel;
}
