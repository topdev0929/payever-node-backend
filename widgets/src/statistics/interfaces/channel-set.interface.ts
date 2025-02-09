import { BusinessInterface } from '../../business/interfaces';

export interface ChannelSetInterface {
  business?: BusinessInterface;
  businessId: string;
  type: string;
  name?: string;
  sells?: number;
  revenue?: number;
  active?: boolean;
  currency?: string;
}
