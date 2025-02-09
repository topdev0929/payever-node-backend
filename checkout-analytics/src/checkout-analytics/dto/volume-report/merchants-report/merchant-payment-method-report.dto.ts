import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';
import { TopMerchantReportDto } from './top-merchant-report.dto';

@Exclude()
export class MerchantPaymentMethodReportDto extends StateReportDto {
  @IsString()
  @Expose()
  public paymentMethod: string;

  @IsArray()
  @Expose()
  public topMerchantsReports: TopMerchantReportDto[] = [];

  @Type(() => StateReportDto)
  @Expose()
  public approvedPaymentMethodReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public inProcessPaymentMethodReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public rejectedPaymentMethodReport: StateReportDto;

  constructor(paymentMethod?: string) {
    super();

    if (paymentMethod) {
      this.paymentMethod = paymentMethod;
    }

    this.approvedPaymentMethodReport = new StateReportDto();
    this.inProcessPaymentMethodReport = new StateReportDto();
    this.rejectedPaymentMethodReport = new StateReportDto();
  }

  public getStateReport(isApproved: boolean): StateReportDto {
    return isApproved ? this.approvedPaymentMethodReport : this.rejectedPaymentMethodReport;
  }
}
