import { FlowAddressInterface } from './flow-address.interface';
import { FlowStatesEnum } from '../../enum';
import { FlowCartItemInterface } from './flow-cart-item.interface';
import { CallbackTypeEnum, CheckoutBusinessTypeEnum, CustomerTypeEnum } from '../../../common/enum';
import { FlowCompanyInterface } from './flow-company.interface';
import { FlowFooterUrlsInterface } from './flow-footer-urls.interface';

export interface FlowInterface {
  /** @deprecated use `checkoutId` instead */
  checkoutUuid?: string;
  /** @deprecated use `id` instead */
  flowId?: string;

  id?: any;
  amount?: number;
  downPayment?: number;
  currency?: string;
  reference?: string;
  total?: number;

  cart?: FlowCartItemInterface[];

  billingAddress?: FlowAddressInterface;
  shippingAddress?: FlowAddressInterface;

  deliveryFee?: number;
  shippingMethodCode?: string;
  shippingMethodName?: string;

  posMerchantMode?: boolean;
  posVerifyType?: number;

  coupon?: string;

  forceLegacyCartStep?: boolean;
  forceLegacyUseInventory?: boolean;

  state: FlowStatesEnum;

  extra?: { };

  apiCallId?: string;
  businessId?: string;
  businessType?: CheckoutBusinessTypeEnum;
  channel?: string;
  pluginVersion?: string;
  channelType?: string;
  channelSetId?: string;
  checkoutId?: string;
  connectionId?: string;
  orderId?: string;

  company?: FlowCompanyInterface;

  disableValidation?: boolean;
  footerUrls?: FlowFooterUrlsInterface;
  hideLogo?: boolean;
  hideImprint?: boolean;

  guestToken?: string;

  paymentId?: string;

  callbackType?: CallbackTypeEnum;
  callbackTriggeredAt?: Date;

  customerType?: CustomerTypeEnum;
}
