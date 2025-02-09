/**
 * @see checkout/src/channel-set/controllers/channel-set.controller.ts
 */
export interface CheckoutChannelSetInterface {
  checkout: string;
  customPolicy: boolean;
  id: string;
  name: string;
  policyEnabled: boolean;
  type: string;
}
