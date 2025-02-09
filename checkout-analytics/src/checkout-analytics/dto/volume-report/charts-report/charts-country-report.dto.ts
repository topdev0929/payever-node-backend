import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ChartsCountryPaymentMethodReportDto } from './charts-country-payment-method-report.dto';
import { StateReportDto } from '../state-report.dto';
import { ReportCountriesEnum } from '../../../enums';
import { ChartsTotalVolumeDto } from './charts-total-volume.dto';

@Exclude()
export class ChartsCountryReportDto extends StateReportDto {
  @IsString()
  @Expose()
  public country: ReportCountriesEnum;

  @IsArray()
  @Expose()
  public paymentMethodsReports: ChartsCountryPaymentMethodReportDto[] = [];

  @Type(() => ChartsTotalVolumeDto)
  @Expose()
  public chartsTotalVolume: ChartsTotalVolumeDto[] = [];

  constructor(country: ReportCountriesEnum) {
    super();

    this.country = country;
  }
}
