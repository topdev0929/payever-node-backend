import { MessageResponseInterface } from './message-response.interface';

export interface BusinessProductsPopularMonthRandomResponseInterface extends MessageResponseInterface {
  id: string;
  products?: any[];
}
