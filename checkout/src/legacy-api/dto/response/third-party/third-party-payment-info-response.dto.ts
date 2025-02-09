import { ThirdPartyPaymentAddressResponseDto } from './third-party-payment-address-response.dto';

export class ThirdPartyPaymentInfoResponseDto {
  public deliveryFee: number;
  public paymentFee: number;
  public amount: number;
  public address: ThirdPartyPaymentAddressResponseDto;
  public apiCallId: string;
  public businessId: string;
  public businessName: string;
  public channel: string;
  public channelType?: string;
  public channelSource?: string;
  public channelSetId: string;
  public currency: string;
  public customerEmail: string;
  public customerName: string;
  public downPayment: number;
  public flowId: string;
  public paymentIssuer?: string;
  public paymentType: string;
  public reference: string;
  public shippingAddress: ThirdPartyPaymentAddressResponseDto;
  public specificStatus: string;
  public status: string;
  public total: number;
}
