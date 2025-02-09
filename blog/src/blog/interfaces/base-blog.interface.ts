import { ChannelSetInterface } from '@pe/channels-sdk';
import { BusinessInterface } from '../../business/interfaces';

export interface BaseBlogInterface {
  channelSet: ChannelSetInterface;
  business?: BusinessInterface;
}
