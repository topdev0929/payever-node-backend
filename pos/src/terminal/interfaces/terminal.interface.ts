import { IntegrationSubscriptionInterface } from '../../integration/interfaces';
import { BaseTerminalInterface } from './base-terminal.interface';

export interface TerminalInterface extends BaseTerminalInterface {
  integrationSubscriptions?: IntegrationSubscriptionInterface[];
  default: boolean;
  defaultLocale: string;
  message: string;
  name: string;
  logo: string;
  locales: string[];
  phoneNumber: string;
  live: boolean;
  forceInstall?: boolean;
}
