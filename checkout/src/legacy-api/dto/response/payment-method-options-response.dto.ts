export class PaymentMethodOptionsResponseDto {
  public shipping_address_allowed: boolean;
  public shipping_address_equality: boolean;
  public fixed_fee: number;
  public variable_fee: number;
  public accept_fee: boolean;
  public is_redirect_method: boolean;
  public is_submit_method: boolean;
  public rates: boolean;
}
