import { FlowPaymentOptionVariantResponseDto } from './flow-payment-option-variant-response.dto';

export class FlowPaymentOptionResponseDto {
  public name: string;
  public paymentMethod: string;
  public paymentIssuer?: string;
  public min: number;
  public max: number;
  public fixedFee: number;
  public variableFee: number;
  public shareBagEnabled: boolean;
  public connections: FlowPaymentOptionVariantResponseDto[];
}
