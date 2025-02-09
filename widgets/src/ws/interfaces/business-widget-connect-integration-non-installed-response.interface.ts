import { MessageResponseInterface } from './message-response.interface';

export interface BusinessWidgetConnectIntegrationNonInstalledResponseInterface extends MessageResponseInterface {
  id: string;
  integrations?: any[];
}
