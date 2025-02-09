import { BusinessInterface } from '../../business/interfaces';

export interface ChannelSetInterface {
  business?: BusinessInterface;
  businessId: string;
  type?: string;
}
