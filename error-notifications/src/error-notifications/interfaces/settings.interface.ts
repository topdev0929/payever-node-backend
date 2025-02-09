import { DefaultSettingsInterface } from './default-settings.interface';

export interface SettingsInterface extends DefaultSettingsInterface{
  readonly businessId: string;
}
