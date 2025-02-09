import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { CountryPaymentMethodReportDto } from './country-payment-method-report.dto';
import { StateReportDto } from '../state-report.dto';
import { ReportCountriesEnum } from '../../../enums';

@Exclude()
export class CountryReportDto extends StateReportDto {
  @IsString()
  @Expose()
  public country: ReportCountriesEnum;

  @IsArray()
  @Expose()
  public paymentMethodsReports: CountryPaymentMethodReportDto[] = [];

  @Type(() => StateReportDto)
  @Expose()
  public approvedCountryReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public inProcessCountryReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public rejectedCountryReport: StateReportDto;

  constructor(country: ReportCountriesEnum) {
    super();

    this.country = country;
    this.approvedCountryReport = new StateReportDto();
    this.inProcessCountryReport = new StateReportDto();
    this.rejectedCountryReport = new StateReportDto();
  }

  public getStateReport(isApproved: boolean): StateReportDto {
    return isApproved ? this.approvedCountryReport : this.rejectedCountryReport;
  }
}
