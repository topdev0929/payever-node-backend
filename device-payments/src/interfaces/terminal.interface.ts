import { CheckoutInterface } from './checkout.interface';

/** @deprecated */
export interface TerminalInterface {
  _id: any;
  name: string;
  businessId: string;
  terminalId: string;
  channelSetId: string;
  checkout: CheckoutInterface | string;
}
