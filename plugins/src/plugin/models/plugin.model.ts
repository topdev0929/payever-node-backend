import { ChannelModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { PluginInterface } from '../interfaces';
import { PluginFileModel } from './index';

export interface PluginModel extends PluginInterface, Document {
  readonly channel: ChannelModel;
  readonly pluginFiles: Types.DocumentArray<PluginFileModel>;
}
