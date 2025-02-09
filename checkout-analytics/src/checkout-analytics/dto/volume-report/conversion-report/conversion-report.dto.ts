import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ConversionPaymentMethodReportDto } from './conversion-payment-method-report.dto';
import { PaymentTypesEnum } from '../../../enums';

@Exclude()
export class ConversionReportDto {
  @IsArray()
  @Expose()
  public paymentMethodsReports: {
    [PaymentTypesEnum.create]: ConversionPaymentMethodReportDto[];
    [PaymentTypesEnum.submit]: ConversionPaymentMethodReportDto[];
  } = { create: [], submit: [] };


  @IsString()
  @Expose()
  public reportDate: string;
}
