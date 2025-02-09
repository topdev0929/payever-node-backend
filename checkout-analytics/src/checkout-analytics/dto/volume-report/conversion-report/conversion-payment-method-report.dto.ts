import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ConversionTopMerchantReportDto } from './conversion-top-merchant-report.dto';
import { ConversionStateReportDto } from '../conversion-state-report.dto';
import { PaymentMethodsEnum, PaymentTypesEnum } from '../../../enums';

@Exclude()
export class ConversionPaymentMethodReportDto extends ConversionStateReportDto {
  @IsString()
  @Expose()
  public paymentMethod: PaymentMethodsEnum;

  @IsArray()
  @Expose()
  public topMerchantsReports: {
    [PaymentTypesEnum.create]: ConversionTopMerchantReportDto[];
    [PaymentTypesEnum.submit]: ConversionTopMerchantReportDto[];
  } = { create: [], submit: [] };

  constructor(paymentMethod?: PaymentMethodsEnum) {
    super();

    if (paymentMethod) {
      this.paymentMethod = paymentMethod;
    }
  }
}
