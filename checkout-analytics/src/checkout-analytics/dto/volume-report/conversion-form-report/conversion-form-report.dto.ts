import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

import { ConversionPaymentMethodFormReportDto } from './conversion-payment-method-form-report.dto';

@Exclude()
export class ConversionFormReportDto {
  @IsArray()
  @Expose()
  public paymentMethodsFormReports: ConversionPaymentMethodFormReportDto[] = [];

  @IsString()
  @Expose()
  public reportDate: string;
}
