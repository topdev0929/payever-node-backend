import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentMethodDevicesReportDto } from './payment-method-devices-report.dto';
import { StateReportDto } from '../state-report.dto';
import { ReportCountriesEnum } from '../../../enums';
import { BrowserTransactionsCountDto } from './browser-transactions-count.dto';
import { DeviceTransactionsCountDto } from './device-transactions-count.dto';

@Exclude()
export class CountryDevicesReportDto extends StateReportDto {
  @IsString()
  @Expose()
  public country: ReportCountriesEnum;

  @IsArray()
  @Expose()
  public paymentMethodsReports: PaymentMethodDevicesReportDto[] = [];

  @Expose()
  @Type(() => BrowserTransactionsCountDto)
  public browserTransactionsCount: BrowserTransactionsCountDto[];

  @Expose()
  @Type(() => DeviceTransactionsCountDto)
  public deviceTransactionsCount: DeviceTransactionsCountDto[];

  constructor(country: ReportCountriesEnum) {
    super();

    this.country = country;
    this.browserTransactionsCount = [];
    this.deviceTransactionsCount = [];
  }
}
