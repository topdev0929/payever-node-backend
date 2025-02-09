import { DisplayOptionsInterface } from './display-options.interface';
import { SettingsOptionsInterface } from './settings-options.interface';

export interface IntegrationInterface {
  readonly autoEnable?: boolean;
  readonly name: string;
  readonly issuer?: string;
  readonly category: string;
  readonly displayOptions: DisplayOptionsInterface;
  readonly isVisible: boolean;
  readonly settingsOptions: SettingsOptionsInterface;
  sortOrder?: number;
}
