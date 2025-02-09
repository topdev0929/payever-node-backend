import { MessagePayloadInterface } from './message-payload.interace';

export interface UninstallWidgetPayloadInterface extends MessagePayloadInterface {
  businessId: string;
  widgetId: string;
}
