import { ChannelInterface, ChannelSetInterface } from '@pe/channels-sdk';

export interface ShopSystemInterface {
  readonly channel: ChannelInterface;
  readonly channelSet: ChannelSetInterface;
  readonly apiKeys: string[];
}
