import { CheckoutInterface } from './checkout.interface';

export interface ApplicationInterface {
  _id: any;
  applicationId: string;
  businessId: string;
  channelSetId: string;
  checkout: CheckoutInterface | string;
  name: string;
  type: string;
}
