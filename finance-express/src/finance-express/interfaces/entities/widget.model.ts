import { WidgetInterface } from './widget.interface';
import { Document } from 'mongoose';
import { BusinessModel } from '../../../business';
import { ChannelSetModel } from '@pe/channels-sdk';

export interface WidgetModel extends WidgetInterface, Document {
  business?: BusinessModel;
  channelSet: ChannelSetModel;
}
