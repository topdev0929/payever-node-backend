import { IntegrationSubscriptionInterface } from '../../integration/interfaces';
import { TerminalInterface } from '../../terminal/interfaces';

export interface BusinessInterface {
  integrationSubscriptions: IntegrationSubscriptionInterface[];
  defaultLanguage?: string;
  terminals: TerminalInterface[];
  logo?: string;
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryTransparency?: string;
  secondaryTransparency?: string;
}
