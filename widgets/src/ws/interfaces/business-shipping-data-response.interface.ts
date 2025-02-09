import { MessageResponseInterface } from './message-response.interface';

export interface BusinessShippingDataResponseInterface extends MessageResponseInterface {
  id: string;
  returned?: number;
  cancelled?: number;
  shipped?: number;
}
