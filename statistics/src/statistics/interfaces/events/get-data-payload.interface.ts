import { MessagePayloadInterface } from './message-payload.interface';

export interface GetDataPayloadInterface extends MessagePayloadInterface {
  widgetId: string;
}
