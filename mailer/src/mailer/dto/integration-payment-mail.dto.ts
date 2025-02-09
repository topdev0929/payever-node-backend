import { IsNotEmpty } from 'class-validator';

export class IntegrationPaymentMailDto {
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  public data: {
    businessId: string;
    paymentMailId: string;
  };
}
