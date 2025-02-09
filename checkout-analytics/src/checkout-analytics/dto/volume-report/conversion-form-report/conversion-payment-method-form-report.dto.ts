import { IsArray, IsString, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

import { PaymentMethodsEnum, ConversionFormReportFieldsEnum } from '../../../enums';
import { ConversionPaymentMethodFormDto } from './conversion-payment-method-form.dto';
import { ConversionPaymentMethodFieldDto } from './conversion-payment-method-field.dto';

@Exclude()
export class ConversionPaymentMethodFormReportDto {
  @IsString()
  @Expose()
  public paymentMethod: PaymentMethodsEnum;

  @IsNumber()
  @Expose()
  public [ConversionFormReportFieldsEnum.AllForms]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionFormReportFieldsEnum.CompletedForms]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionFormReportFieldsEnum.InCompletedForms]: number = 0.0;

  @IsArray()
  @Expose()
  public forms: ConversionPaymentMethodFormDto[] = [];

  @IsArray()
  @Expose()
  public fields: ConversionPaymentMethodFieldDto[] = [];

  constructor(paymentMethod?: PaymentMethodsEnum) {
    if (paymentMethod) {
      this.paymentMethod = paymentMethod;
    }
  }
}
