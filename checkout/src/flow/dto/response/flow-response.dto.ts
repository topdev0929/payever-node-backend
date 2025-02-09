import { FlowCartItemResponseDto } from './flow-cart-item-response.dto';
import { FlowAddressResponseDto } from './flow-address-response.dto';
import { FlowStatesEnum } from '../../enum';
import { FlowPaymentOptionResponseDto } from './flow-payment-option-response.dto';
import { FlowApiCallResponseDto } from './flow-api-call-response.dto';
import { CheckoutBusinessTypeEnum, CustomerTypeEnum } from '../../../common/enum';
import { FlowCompanyResponseDto } from './flow-company-response.dto';
import { FlowFooterUrlsResponseDto } from './flow-footer-urls-response.dto';

export class FlowResponseDto {
  public id: string;
  public amount: number;
  public downPayment: number;
  public total: number;
  public currency: string;
  public reference: string;
  public cart: FlowCartItemResponseDto[];
  public billingAddress: FlowAddressResponseDto;
  public shippingAddress: FlowAddressResponseDto;
  public deliveryFee: number;
  public shippingMethodCode: string;
  public shippingMethodName: string;
  public posMerchantMode: boolean;
  public posVerifyType: number;
  public coupon: string;
  public forceLegacyCartStep: boolean;
  public forceLegacyUseInventory: boolean;
  public state: FlowStatesEnum;
  public extra: { };

  public businessId: string;
  public businessName: string;
  public businessCountry: string;
  public businessIban: string;
  public businessAddressLine: string;
  public businessType: CheckoutBusinessTypeEnum;

  public b2bSearch?: boolean;

  public customerType?: CustomerTypeEnum;

  public channel: string;
  public channelSetId: string;
  public channelType: string;
  public channelSource: string;

  public pluginVersion: string;

  public checkoutId: string;
  public connectionId: string;
  public orderId?: string;

  public paymentOptions: FlowPaymentOptionResponseDto[];

  public apiCall?: FlowApiCallResponseDto;

  public company?: FlowCompanyResponseDto;

  public disableValidation?: boolean;
  public footerUrls?: FlowFooterUrlsResponseDto;
  public hideLogo?: boolean;
  public hideImprint?: boolean;

  public guestToken?: string;
}
