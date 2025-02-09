import { ThirdPartyPaymentInfoResponseDto } from './third-party-payment-info-response.dto';

export class ThirdPartyPaymentSubmitWrapperResponseDto {
  public id: string;
  public createdAt: string;
  public payment: ThirdPartyPaymentInfoResponseDto;
  public paymentDetails: object;
}
