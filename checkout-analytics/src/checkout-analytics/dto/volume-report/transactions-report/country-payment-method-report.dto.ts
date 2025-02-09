import { IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';
import { PaymentMethodsEnum } from '../../../enums';
import { PaymentInterface, TransactionsAwareReportInterface } from '../../../interfaces';

@Exclude()
export class CountryPaymentMethodReportDto extends StateReportDto implements TransactionsAwareReportInterface {
  @IsString()
  @Expose()
  public paymentMethod: PaymentMethodsEnum;

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

  constructor(paymentMethod: PaymentMethodsEnum) {
    super();

    this.paymentMethod = paymentMethod;
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
