import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { CountryReportDto } from './country-report.dto';
import { StateReportDto } from '../state-report.dto';

@Exclude()
export class TransactionsReportDto extends StateReportDto {
  @IsArray()
  @Expose()
  public countriesReports: CountryReportDto[] = [];

  @Type(() => StateReportDto)
  @Expose()
  public overallApprovedReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public overallInProcessReport: StateReportDto;

  @Type(() => StateReportDto)
  @Expose()
  public overallRejectedReport: StateReportDto;

  @IsString()
  @Expose()
  public reportDate: string;

  constructor() {
    super();

    this.overallApprovedReport = new StateReportDto();
    this.overallInProcessReport = new StateReportDto();
    this.overallRejectedReport = new StateReportDto();
  }

  public getStateReport(isApproved: boolean): StateReportDto {
    return isApproved ? this.overallApprovedReport : this.overallRejectedReport;
  }
}
