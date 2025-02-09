import { ChannelSetInterface } from '@pe/channels-sdk';
import { BusinessInterface } from '../../business/interfaces';

export interface BaseTerminalInterface {
  active: boolean;
  business?: BusinessInterface;
  businessId: string;
  channelSets: ChannelSetInterface[];
  defaultLocale?: string;
}
