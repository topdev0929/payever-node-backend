export class BusinessAmountLimitsDto {
  public businessId: string;
  public paymentMethod: string;
  public paymentIssuer?: string;

  public max?: number;
  public min?: number;
}
