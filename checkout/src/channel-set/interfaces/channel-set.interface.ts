import { CheckoutInterface } from '../../checkout';

export interface ChannelSetInterface {
  checkout?: CheckoutInterface | string;
  name?: string;
  type?: string;
  subType?: string;
  active?: boolean;
  enabledByDefault?: boolean;
  customPolicy?: boolean;
  policyEnabled?: boolean;
  originalId?: string;
}
