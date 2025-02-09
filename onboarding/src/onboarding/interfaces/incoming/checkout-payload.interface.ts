import { CheckoutSettingsPayloadInterface } from '../outgoing';

export interface CheckoutPayloadInterface {
  logo?: string;
  name: string;
  settings?: CheckoutSettingsPayloadInterface;
  channels: string[];
  sections?: {
    preset?: string;
  };
}
