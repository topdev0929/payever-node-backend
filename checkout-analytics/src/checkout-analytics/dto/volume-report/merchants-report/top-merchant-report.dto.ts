import { IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';
import { PaymentInterface, TransactionsAwareReportInterface } from '../../../interfaces';

@Exclude()
export class TopMerchantReportDto extends StateReportDto implements TransactionsAwareReportInterface {
  @IsString()
  @Expose()
  public merchantName: string;

  @IsString()
  @Expose()
  public merchantId: string;

  @Type(() => StateReportDto)
  @Expose()
  public approvedReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public inProcessReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public rejectedReport: StateReportDto;

  @Expose()
  public approvedTransactions: Map<string, PaymentInterface>;

  @Expose()
  public inProcessTransactions: Map<string, PaymentInterface>;

  @Expose()
  public rejectedTransactions: Map<string, PaymentInterface>;

  constructor(merchantName: string, merchantId: string = null) {
    super();

    this.merchantName = merchantName;
    this.merchantId = merchantId;

    this.approvedReport = new StateReportDto();
    this.inProcessReport = new StateReportDto();
    this.rejectedReport = new StateReportDto();
    this.approvedTransactions = new Map<string, PaymentInterface>();
    this.inProcessTransactions = new Map<string, PaymentInterface>();
    this.rejectedTransactions = new Map<string, PaymentInterface>();
  }

  public getStateReport(isApproved: boolean): StateReportDto {
    return isApproved ? this.approvedReport : this.rejectedReport;
  }
}
