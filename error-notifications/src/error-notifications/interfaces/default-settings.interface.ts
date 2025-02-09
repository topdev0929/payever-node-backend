import { ErrorNotificationTypesEnum } from '../enums';
import { AbstractSettingsInterface } from './';

export interface DefaultSettingsInterface extends AbstractSettingsInterface {
  type: ErrorNotificationTypesEnum;
}
