import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultCheckoutDataResponseInterface extends MessageResponseInterface {
  id: string;
  checkoutId?: string;
  checkoutName?: string;
  linkChannelSetId?: string;
}
