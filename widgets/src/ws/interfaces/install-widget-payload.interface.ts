import { MessagePayloadInterface } from './message-payload.interace';

export interface InstallWidgetPayloadInterface extends MessagePayloadInterface {
  businessId: string;
  widgetId: string;
}
