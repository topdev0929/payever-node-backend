import { PluginCommandNameEnum } from '../enums';
import { PluginCommandInterface } from './plugin-command.interface';

export interface PluginInstanceRegistryInterface {
  cmsVersion: string;
  pluginVersion: string;
  channel: string;
  host: string;
  supportedCommands: PluginCommandNameEnum[];
  acknowledgedCommands?: PluginCommandInterface[];
  commandEndpoint?: string;
  businessIds?: string[];
}
