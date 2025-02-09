export interface CheckoutPayloadInterface {
  checkoutId: string;
  businessId: string;
  linkChannelSetId: string;
  settings: any;
  cspAllowedHosts: string[];
}
