import { BusinessInterface } from './business.interface';

export interface ChannelSetInterface {
  business?: BusinessInterface;
  businessId: string;
  type?: string;
}
