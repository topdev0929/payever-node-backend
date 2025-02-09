import { TaskType } from '../../enums';
import { AppsPayloadInterface } from './apps-payload.interface';
import { BusinessPayloadInterface } from './business-payload.interface';
import { CheckoutPayloadInterface } from './checkout-payload.interface';
import { ConnectPayloadInterface } from './connect-payload.interface';
import { ConnectSettingsPayloadInterface } from './connect-settings-payload.interface';

export interface SetupMessageInterface {
  template?: string;
  [TaskType.Checkout]?: CheckoutPayloadInterface;
  [TaskType.Business]?: BusinessPayloadInterface;
  [TaskType.Wallpaper]: boolean;
  [TaskType.Apps]?: AppsPayloadInterface;
  [TaskType.Connect]?: ConnectPayloadInterface;
  [TaskType.ConnectSettings]?: ConnectSettingsPayloadInterface;
  [TaskType.Pos]?: boolean;
}
