import { ConnectDisplayOptionsInterface } from './connect-display-options.interface';
import { InstallationOptionsInterface } from './installation-options.interface';

export interface ConnectIntegrationInterface {
  category: string;
  connect: any;
  displayOptions: ConnectDisplayOptionsInterface;
  installationOptions: InstallationOptionsInterface;
  name: string;
}
