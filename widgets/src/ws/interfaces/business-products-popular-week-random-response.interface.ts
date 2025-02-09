import { MessageResponseInterface } from './message-response.interface';

export interface BusinessProductsPopularWeekRandomResponseInterface extends MessageResponseInterface {
  id: string;
  products?: any[];
}
