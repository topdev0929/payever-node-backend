import { PluginCommandNameEnum } from '../enums';

export interface PluginCommandInterface {
  name: PluginCommandNameEnum;
  value: string;
  metadata: { };
  channelType?: string;
  minCmsVersion?: string;
  maxCmsVersion?: string;
}
