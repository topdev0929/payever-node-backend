import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ConversionStateReportDto } from '../conversion-state-report.dto';

@Exclude()
export class ConversionTopMerchantReportDto extends ConversionStateReportDto {
  @IsString()
  @Expose()
  public merchantName: string;

  @IsString()
  @Expose()
  public merchantId: string;

  constructor(merchantName: string, merchantId: string = null) {
    super();

    this.merchantName = merchantName;
    this.merchantId = merchantId;
  }
}
