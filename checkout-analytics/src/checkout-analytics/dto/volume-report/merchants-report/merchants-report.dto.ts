import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { MerchantPaymentMethodReportDto } from './merchant-payment-method-report.dto';

@Exclude()
export class MerchantsReportDto {
  @IsArray()
  @Expose()
  public paymentMethodsReports: MerchantPaymentMethodReportDto[] = [];

  @IsString()
  @Expose()
  public reportDate: string;
}
