import { ChannelInterface } from '@pe/channels-sdk';
import { PluginFileInterface } from './plugin-file.interface';

export interface PluginInterface {
  readonly channel: ChannelInterface;
  readonly description: string;
  readonly documentation: string;
  readonly marketplace: string;
  readonly pluginFiles: PluginFileInterface[];
}
