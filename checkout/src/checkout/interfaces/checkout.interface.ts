import { ConnectionInterface } from '../../connection/interfaces';
import { ChannelSettingsInterface } from './channel-settings.interface';
import { CheckoutSectionInterface } from './checkout-section.interface';
import { CheckoutSettingsInterface } from './checkout-settings.interface';

export interface CheckoutInterface {
  businessId: string;
  default: boolean;
  logo?: string;
  name: string;

  channelSettings?: ChannelSettingsInterface;
  sections?: CheckoutSectionInterface[];
  settings?: CheckoutSettingsInterface;

  connections: ConnectionInterface[];
}
