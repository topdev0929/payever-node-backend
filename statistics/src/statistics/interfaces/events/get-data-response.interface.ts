import { MessageResponseInterface } from './message-response.interface';

export interface GetDataResponseInterface extends MessageResponseInterface {
  data?: any;
  widgetId?: string;
  useCache: boolean;
  defaultData?: any;
}
