import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ReportCountriesEnum } from '../../../enums';
import { ResponseTimeStateDto } from './response-time-state.dto';
import { PaymentMethodResponseTimeReportDto } from './payment-method-response time-report.dto';

@Exclude()
export class CountryResponseTimeReportDto extends ResponseTimeStateDto {
  @IsString()
  @Expose()
  public country: ReportCountriesEnum;

  @IsArray()
  @Expose()
  public paymentMethodsReports: PaymentMethodResponseTimeReportDto[] = [];

  constructor(country: ReportCountriesEnum) {
    super();

    this.country = country;
  }
}
