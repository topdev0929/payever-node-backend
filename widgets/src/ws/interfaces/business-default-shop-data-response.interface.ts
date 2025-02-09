import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultShopDataResponseInterface extends MessageResponseInterface {
  id: string;
  shopId?: string;
  shopName?: string;
  shopLogo?: string;
}
