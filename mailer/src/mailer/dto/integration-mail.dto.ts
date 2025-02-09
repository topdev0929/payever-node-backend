import { IsNotEmpty } from 'class-validator';

export class IntegrationMailDto {
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  public data: {
    businessId: string;
    body: string;
    subject: string;
    to: string;
  };
}
