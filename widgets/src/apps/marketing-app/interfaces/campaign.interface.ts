import { ChannelSetInterface } from '../../../statistics/interfaces';

export interface CampaignInterface {
  businessId: string;
  channelSet: ChannelSetInterface | string;
  name: string;
  contactsCount: number;
}
