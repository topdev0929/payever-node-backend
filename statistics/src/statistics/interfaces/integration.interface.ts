import { InstallationOptionsInterface } from './installation-options.interface';

export interface IntegrationInterface {
  allowedBusinesses?: string[];
  readonly name: string;
  readonly category: string;
  categoryIcon?: string;
  readonly enabled: boolean;
  readonly installationOptions: InstallationOptionsInterface;
  readonly order: number;
  timesInstalled: number;
  isConnected?: boolean;
  createdAt: string;
  updatedAt: string;
}
